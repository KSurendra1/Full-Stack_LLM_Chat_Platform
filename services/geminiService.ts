
import { GoogleGenAI, Chat } from '@google/genai';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using a mock service.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export const createChatSession = (): Chat | null => {
  if (!ai) return null;
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are a helpful AI assistant. Keep your responses concise and friendly.',
    },
  });
};

export async function* generateStream(chat: Chat, message: string): AsyncGenerator<string> {
  try {
    const result = await chat.sendMessageStream({ message });
    for await (const chunk of result) {
      yield chunk.text;
    }
  } catch (error) {
    console.error("Error generating stream from Gemini:", error);
    yield "Sorry, I encountered an error. Please try again.";
  }
}

export async function* mockGenerateStream(message: string): AsyncGenerator<string> {
    const mockResponse = `This is a mocked response for your prompt: "${message}". The Gemini API key is not configured. Please set the API_KEY environment variable to get live responses.`;
    const words = mockResponse.split(' ');
    for (const word of words) {
        yield word + ' ';
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

export async function generateChatTitle(prompt: string): Promise<string> {
    if (!ai) {
        return prompt.split(' ').slice(0, 5).join(' ') + (prompt.split(' ').length > 5 ? '...' : '');
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a short, concise title (max 5 words) for a conversation that starts with this user prompt: "${prompt}". Do not include quotes or any other punctuation in your response.`,
        });
        return response.text.trim().replace(/"/g, '');
    } catch (error) {
        console.error("Error generating chat title:", error);
        return "New Conversation";
    }
}
