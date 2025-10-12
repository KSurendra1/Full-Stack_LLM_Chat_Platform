import React, { useState } from 'react';
import { Message, Sender } from '../types';
import { CopyIcon, CheckIcon, UserCircleIcon, ChatBubbleIcon } from './icons';
import { useAuth } from '../contexts/AuthContext';

interface ChatMessageProps {
  message: Message;
}

const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-900 rounded-md my-2">
      <div className="flex items-center justify-between px-4 py-1 bg-gray-800 rounded-t-md text-xs text-gray-400">
        <span>Code</span>
        <button onClick={handleCopy} className="flex items-center gap-1.5 hover:text-white">
          {copied ? <CheckIcon className="w-4 h-4 text-green-500" /> : <CopyIcon className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 text-sm text-white overflow-x-auto">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { user } = useAuth();
  const parts = message.text.split(/(```[\s\S]*?```)/g);
  const isUser = message.sender === Sender.User;
  const userInitial = user ? user.name.charAt(0) : 'U';

  return (
    <div className={`flex gap-4 my-6 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
          <ChatBubbleIcon className="w-5 h-5 text-gray-600" />
        </div>
      )}
      <div className="max-w-2xl">
        <div className={`rounded-xl ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
          <div className="p-4">
            {parts.map((part, index) => {
              if (part.startsWith('```') && part.endsWith('```')) {
                const code = part.slice(3, -3).trim();
                return <CodeBlock key={index} code={code} />;
              }
              return (
                <p key={index} className="whitespace-pre-wrap leading-relaxed">
                  {part}
                </p>
              );
            })}
          </div>
        </div>
      </div>
       {isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 font-bold text-white">
          {userInitial}
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
