
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { useChat } from '../hooks/useChat';
import Header from './Header';

const ChatLayout: React.FC = () => {
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    startNewChat, 
    credits,
    chatHistory,
    activeChatId,
    setActiveChat
  } = useChat();
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      <Header credits={credits} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={() => setSidebarCollapsed(!isSidebarCollapsed)}
            onNewChat={startNewChat}
            chatHistory={chatHistory}
            activeChatId={activeChatId}
            onSelectChat={setActiveChat}
        />
        <main className="flex-1 overflow-hidden">
            <ChatWindow 
              messages={messages}
              isLoading={isLoading}
              onSendMessage={sendMessage}
            />
        </main>
      </div>
    </div>
  );
};

export default ChatLayout;
