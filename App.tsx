import React from 'react';
import AuthPage from './components/auth/AuthPage';
import ChatLayout from './components/ChatLayout';
import { useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="h-screen w-full bg-white text-gray-900 font-sans">
      {isAuthenticated ? <ChatLayout /> : <AuthPage />}
    </div>
  );
};

export default App;
