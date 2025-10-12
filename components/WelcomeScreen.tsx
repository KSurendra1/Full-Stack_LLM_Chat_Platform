import React from 'react';
import { SparklesIcon, ChatBubbleIcon } from './icons';

interface WelcomeScreenProps {
    onPromptClick: (prompt: string) => void;
}

const PromptSuggestion: React.FC<{ text: string; onClick: () => void }> = ({ text, onClick }) => (
    <button
      onClick={onClick}
      className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer transition-all text-left w-full"
    >
        <div className="flex items-start gap-3">
            <ChatBubbleIcon className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
            <p className="text-gray-700 text-sm">{text}</p>
        </div>
    </button>
);


const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onPromptClick }) => {
    const examplePrompts = [
        "Explain quantum computing in simple terms",
        "Write a Python function to sort a list",
        "What are the benefits of meditation?",
        "Help me plan a weekend trip to Paris"
    ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 max-w-3xl mx-auto">
        <SparklesIcon className="w-12 h-12 text-blue-600 mb-4" />
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome to AI Chat</h2>
        <p className="text-center mb-10">
            Start a conversation with our AI assistant. Ask questions, get help with tasks, or explore ideas together.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            {examplePrompts.map((prompt, index) => (
                <PromptSuggestion key={index} text={prompt} onClick={() => onPromptClick(prompt)} />
            ))}
        </div>
    </div>
  );
};

export default WelcomeScreen;
