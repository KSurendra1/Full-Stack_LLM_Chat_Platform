
import React from 'react';
import { PlusIcon, EmptyChatIcon, ChevronLeftIcon, ChatBubbleIcon } from './icons';
import type { ChatSession } from '../hooks/useChat';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  onNewChat: () => void;
  chatHistory: Pick<ChatSession, 'id' | 'title'>[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  toggleSidebar, 
  onNewChat,
  chatHistory,
  activeChatId,
  onSelectChat,
}) => {
  return (
    <aside
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-0 p-0' : 'w-72 p-4'
      } relative`}
      style={{ overflow: 'hidden' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Conversations</h2>
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-gray-100"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <button
        onClick={onNewChat}
        className="flex items-center justify-center gap-2 w-full px-4 py-2 mb-4 text-white font-semibold bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <PlusIcon className="w-5 h-5" />
        New Chat
      </button>

      <div className="flex-1 overflow-y-auto pr-1 -mr-2">
        {chatHistory.length > 0 ? (
          <ul className="space-y-1">
            {chatHistory.map((chat) => (
              <li key={chat.id}>
                <button
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center gap-3 transition-colors ${
                    activeChatId === chat.id
                      ? 'bg-blue-100 text-blue-800 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <ChatBubbleIcon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{chat.title}</span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-500 h-full">
            <EmptyChatIcon className="w-12 h-12 mb-2" />
            <p className="text-sm font-medium">No conversations yet</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
