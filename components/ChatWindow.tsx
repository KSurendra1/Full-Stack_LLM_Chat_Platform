import React, { useState, useRef, useEffect } from 'react';
import type { Message } from '../types';
import ChatMessage from './ChatMessage';
import WelcomeScreen from './WelcomeScreen';
import { PaperPlaneIcon } from './icons';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

const MAX_CHARACTERS = 2000;

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onSendMessage }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto';
        const scrollHeight = textAreaRef.current.scrollHeight;
        textAreaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= MAX_CHARACTERS) {
        setInput(e.target.value);
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <WelcomeScreen onPromptClick={(prompt) => setInput(prompt)} />
        ) : (
          <div className="pt-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white w-full max-w-4xl mx-auto">
          <div className="bg-white border border-gray-300 rounded-2xl p-2 shadow-sm">
            <div className="flex items-end gap-2">
              <textarea
                ref={textAreaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything..."
                rows={1}
                className="w-full bg-transparent p-2 text-gray-900 placeholder-gray-500 resize-none focus:outline-none max-h-48"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                className="p-3 rounded-xl bg-blue-600 text-white disabled:bg-gray-300 disabled:text-gray-500 hover:bg-blue-700 transition-colors shrink-0"
                disabled={isLoading || !input.trim()}
              >
                <PaperPlaneIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 px-2">
            <p className="text-xs text-gray-500">Press Enter to send, Shift+Enter for new line</p>
            <p className="text-xs text-gray-500">{input.length}/{MAX_CHARACTERS}</p>
          </div>
      </div>
    </div>
  );
};

export default ChatWindow;
