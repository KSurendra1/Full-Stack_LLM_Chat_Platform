# Full-Stack LLM Chat Platform

This is a complete, feature-rich chat platform powered by Large Language Models (LLMs). It features a modern, clean user interface and includes core functionalities like user authentication, persistent chat history, a credit-based usage system, and real-time notifications.

Live link : https://full-stack-llm-chat-platform-ebon.vercel.app/

## ✨ Key Features

- **Modern UI/UX:** A clean, responsive, and intuitive chat interface built with React and Tailwind CSS, inspired by leading AI platforms.
- **Real-time Chat:** Streaming responses from the Gemini API for a dynamic and engaging conversation experience.
- **Persistent Chat History:** Automatically saves all conversations. Users can view their chat history in the sidebar and seamlessly switch between different topics.
- **AI-Powered Titling:** New chats are automatically given a concise title based on the user's initial prompt, making conversations easy to find later.
- **Secure Authentication:** A complete authentication flow (Login/Sign-Up) with session persistence using `localStorage`.
- **Credit System:** A client-side credit management system that deducts a configurable number of credits for each message sent. The current balance is always visible in the header.
- **Real-Time Notifications:** A fully functional notification panel with a (simulated) real-time update mechanism to demonstrate asynchronous user alerts.
- **Markdown Support:** Intelligently renders code blocks within chat messages, complete with a "Copy" button for easy access.

## 💻 Tech Stack

- **Frontend:**
  - **React:** A JavaScript library for building user interfaces.
  - **TypeScript:** Typed superset of JavaScript that compiles to plain JavaScript.
  - **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **AI Integration:**
  - **Google Gemini API (`@google/genai`):** Powers the chat responses and AI-driven features like title generation.

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/llm-chat-platform.git
    cd llm-chat-platform
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```
    
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running on `http://localhost:5173` (or another port if 5173 is busy).

## 🔑 API Key Configuration

For simplicity in this demonstration, the Google Gemini API key is currently hardcoded in `src/services/geminiService.ts`.

**⚠️ Security Warning:** This is **not secure** for a production environment. Do not commit your real API keys to version control. In a real-world application, you should use a backend proxy or a secure method for handling API keys on the client-side. For local development with frameworks like Vite or Next.js, you would typically use an environment variable (e.g., `VITE_GEMINI_API_KEY`) in a `.env` file.

> **Note:** If the API key is removed from `geminiService.ts`, the application will fall back to using a mock service, which returns pre-defined responses instead of making live API calls.

## 📂 Project Structure

The project is organized with a clear separation of concerns to ensure maintainability and scalability.

```
src/
├── components/       # Reusable UI components (Sidebar, ChatWindow, etc.)
│   ├── auth/         # Authentication-specific components
│   └── ...
├── contexts/         # Global state management with React Context (Auth, Notifications)
├── hooks/            # Custom React hooks with business logic (useChat)
├── services/         # API clients and external service integrations (geminiService)
├── types.ts          # Shared TypeScript type definitions
├── App.tsx           # Main application component with routing
└── index.tsx         # Application entry point
```

## 🔧 How It Works

### State Management

The application leverages **React Context** for global state management, avoiding prop drilling and centralizing logic.

-   **`AuthContext`:** Manages user authentication state, user data, and the `login`/`logout` functions. It persists the user's session to `localStorage`.
-   **`NotificationContext`:** Manages the list of notifications, tracks unread counts, and simulates real-time updates.
-   **`useChat` (Hook):** This is the core of the application's client-side logic. It manages the active chat, the entire chat history, message streaming, loading/error states, the credit balance, and interactions with the `geminiService`.

### AI Integration

All interactions with the Google Gemini API are handled in `src/services/geminiService.ts`.

-   **Streaming Responses:** The service uses the `sendMessageStream` method to get real-time, streamed responses from the model.
-   **Chat Titling:** A separate `generateChatTitle` function makes a one-off call to the Gemini API to summarize the user's first prompt into a concise title.
-   **Mock Service:** If no API key is provided, the service gracefully falls back to a `mockGenerateStream` function, allowing the UI to be fully interactive without a live connection.
