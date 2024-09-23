"use client";
import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Send } from 'lucide-react';
import ChatSidebar from '../_component/Sidebar';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    setIsLoading(true);
    try {
      const result = await model.generateContent(input);
      const botMessage = {
        role: 'assistant',
        content: result.response.text(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error generating content:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-b from-[#F5B5C2] via-[#E6D7FF] to-[#E0F7FA]">
      {/* Sidebar */}
      <div className="relative">
        <ChatSidebar />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col items-center">
        {/* Chat messages */}
        <div className="w-full max-w-3xl flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xl px-4 py-2 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-[#E0F7FA] text-black'
                    : 'bg-white text-black shadow-md'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="w-full max-w-3xl pb-6 px-4">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="w-full focus:outline-none focus:placeholder-gray-400 text-black placeholder-gray-500 pl-4 pr-12 py-3 rounded-full bg-white shadow-md"
            />
            <button
              onClick={handleSend}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out text-white bg-[#F5B5C2] hover:bg-[#E6D7FF] focus:outline-none"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
