import { useState, useCallback, useEffect } from 'react';
import type { Message } from '../types';
import { Sender } from '../types';
import { createChatSession, generateStream, mockGenerateStream, generateChatTitle } from '../services/geminiService';
import type { Chat } from '@google/genai';

const INITIAL_CREDITS = 1000;
const COST_PER_MESSAGE = 10;

export type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  chat: Chat | null;
};

// Mock API data for chat history
const MOCK_CHAT_HISTORY_DATA: Omit<ChatSession, 'chat'>[] = [
    {
        id: 'chat-1',
        title: 'Exploring React Hooks',
        messages: [
            { id: 'msg-1-1', text: 'What are React Hooks?', sender: Sender.User },
            { id: 'msg-1-2', text: 'React Hooks are functions that let you “hook into” React state and lifecycle features from function components.', sender: Sender.Assistant },
        ],
    },
    {
        id: 'chat-2',
        title: 'Python Sorting Algorithms',
        messages: [
            { id: 'msg-2-1', text: 'Can you show me a simple Python sorting function?', sender: Sender.User },
            { id: 'msg-2-2', text: 'Certainly! Here is a bubble sort implementation in Python:\n```python\ndef bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if arr[j] > arr[j+1]:\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n```', sender: Sender.Assistant },
        ],
    },
    {
        id: 'chat-3',
        title: 'Weekend Trip to Paris',
        messages: [
            { id: 'msg-3-1', text: 'Help me plan a weekend trip to Paris', sender: Sender.User },
            { id: 'msg-3-2', text: 'Of course! To give you the best recommendations, could you tell me what your interests are? For example, are you into art, history, food, or something else?', sender: Sender.Assistant },
        ],
    }
];


export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState(INITIAL_CREDITS);

  // Effect to load initial chat history from a mock API
  useEffect(() => {
    const loadInitialHistory = async () => {
      // In a real app, this would be an API call.
      // We simulate it with a timeout.
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const historyWithChatInstances = MOCK_CHAT_HISTORY_DATA.map(session => ({
        ...session,
        chat: createChatSession(), // Assign a new chat instance to each history item
      }));
      
      setChatHistory(historyWithChatInstances);
      
      // Set the first chat as active by default
      if (historyWithChatInstances.length > 0) {
        const firstChat = historyWithChatInstances[0];
        setActiveChatId(firstChat.id);
        setMessages(firstChat.messages);
      }
    };

    loadInitialHistory();
  }, []); // Empty array ensures this runs only once on mount

  // Helper to update a specific chat session in the history
  const updateChatInHistory = (chatId: string, updates: Partial<ChatSession>) => {
    setChatHistory(prev =>
      prev.map(chat => (chat.id === chatId ? { ...chat, ...updates } : chat))
    );
  };

  const setActiveChat = useCallback((chatId: string) => {
      if (chatId === activeChatId) return;

      // 1. Save the current active chat's messages to the history state
      if (activeChatId) {
        updateChatInHistory(activeChatId, { messages });
      }

      // 2. Set the new active chat ID
      setActiveChatId(chatId);

      // 3. Load the new active chat's messages into the main message state
      const newActiveChat = chatHistory.find(c => c.id === chatId);
      setMessages(newActiveChat?.messages ?? []);
    }, [activeChatId, messages, chatHistory]
  );

  const startNewChat = useCallback(() => {
    // If there's an active chat, save its messages before creating a new one
    if (activeChatId) {
      const currentChat = chatHistory.find(c => c.id === activeChatId);
      // Don't save empty "New Chat" sessions if user clicks "New Chat" again
      if (currentChat && currentChat.messages.length > 0) {
        updateChatInHistory(activeChatId, { messages });
      } else if (currentChat && currentChat.messages.length === 0 && chatHistory.some(c => c.id === activeChatId)) {
        // If the current chat is empty, and it exists in history, remove it before creating a new one
        setChatHistory(prev => prev.filter(c => c.id !== activeChatId));
      }
    }

    const newId = `chat-${Date.now()}`;
    const newChat: ChatSession = {
      id: newId,
      title: 'New Chat',
      messages: [],
      chat: createChatSession(),
    };
    
    setChatHistory(prev => [newChat, ...prev]);
    setActiveChatId(newId);
    setMessages([]);
  }, [activeChatId, messages, chatHistory]);

  const sendMessage = useCallback(async (text: string) => {
      if (isLoading || credits < COST_PER_MESSAGE || !activeChatId) return;

      const currentMessages = chatHistory.find(c => c.id === activeChatId)?.messages ?? messages;
      const isNewChat = currentMessages.length === 0;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        text,
        sender: Sender.User,
      };
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      setCredits(prev => prev - COST_PER_MESSAGE);
      setError(null);

      const assistantMessageId = `assistant-${Date.now()}`;
      setMessages(prev => [...prev, { id: assistantMessageId, text: '', sender: Sender.Assistant }]);

      try {
        const currentChatSession = chatHistory.find(c => c.id === activeChatId);
        const chatInstance = currentChatSession?.chat;

        // Generate a title in the background if it's the first message
        if (isNewChat) {
          generateChatTitle(text).then(title => {
            updateChatInHistory(activeChatId, { title });
          });
        }

        const streamGenerator = chatInstance ? generateStream(chatInstance, text) : mockGenerateStream(text);
        
        let finalAssistantText = '';
        for await (const chunk of streamGenerator) {
          finalAssistantText += chunk;
          setMessages(prev =>
            prev.map(msg =>
              msg.id === assistantMessageId ? { ...msg, text: finalAssistantText } : msg
            )
          );
        }
      } catch (e) {
        const err = e instanceof Error ? e.message : 'An unknown error occurred.';
        setError(err);
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMessageId ? { ...msg, text: `Error: ${err}` } : msg
          )
        );
      } finally {
        setIsLoading(false);
      }
    }, [isLoading, credits, activeChatId, messages, chatHistory]
  );

  // Effect to save the latest messages to history when the stream is finished
  useEffect(() => {
    if (!isLoading && activeChatId) {
      updateChatInHistory(activeChatId, { messages });
    }
  }, [isLoading, messages, activeChatId]);


  return { messages, isLoading, error, sendMessage, startNewChat, credits, chatHistory, activeChatId, setActiveChat };
};