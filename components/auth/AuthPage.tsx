import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white border border-gray-200 rounded-2xl shadow-sm">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-bold text-gray-900">AI Chat</h1>
          <h2 className="mt-6 text-xl font-semibold text-gray-900">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isLogin ? "Sign in to continue your session" : "Get started with your new account"}
          </p>
        </div>

        {isLogin ? <LoginForm /> : <SignUpForm />}

        <div className="text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-sm text-blue-600 hover:text-blue-500"
          >
            {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Log In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
