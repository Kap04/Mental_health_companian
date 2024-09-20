"use client"
import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Send } from 'lucide-react';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''; // Use a public env variable for safety
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]); // Stores chat history
  const [isLoading, setIsLoading] = useState(false); // To show a loading indicator

  const handleSend = async () => {
    if (!input.trim()) return; // Ignore empty input

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]); // Add user message to chat history
    setInput(''); // Clear input

    setIsLoading(true); // Show loading indicator
    try {
      // Send prompt to the model
      const result = await model.generateContent(input);
      const botMessage = {
        role: 'assistant',
        content: result.response.text(),
      };  

      setMessages((prev) => [...prev, botMessage]); // Add bot response to chat history
    } catch (error) {
      console.error('Error generating content:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong.' },
      ]);
    } finally {
      setIsLoading(false); // Stop loading indicator
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-sky-800 text-gray-300 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-white">Chat History</h2>
        <ul className="space-y-2">
          <li className="cursor-pointer hover:bg-gray-800 p-2 rounded transition duration-150 ease-in-out">Chat 1</li>
          <li className="cursor-pointer hover:bg-gray-800 p-2 rounded transition duration-150 ease-in-out">Chat 2</li>
          <li className="cursor-pointer hover:bg-gray-800 p-2 rounded transition duration-150 ease-in-out">Chat 3</li>
        </ul>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-sky-100">
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xl px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 px-4 py-4 sm:mb-0">
          <div className="relative flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-4 bg-gray-100 rounded-md py-3"
            />
            <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
              <button
                onClick={handleSend}
                className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-blue-500 hover:bg-blue-400 focus:outline-none"
              >
                <span className="font-bold">Send</span>
                <Send size={24} className="ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
