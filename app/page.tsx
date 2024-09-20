"use client"
import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Send } from 'lucide-react';

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
    <div className="flex h-screen bg-green-50">
      {/* Sidebar */}
      <div className="w-64 bg-teal-700 text-teal-100 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-white">Chat History</h2>
        <ul className="space-y-2">
          <li className="cursor-pointer hover:bg-teal-600 p-2 rounded transition duration-150 ease-in-out">Previous Session 1</li>
          <li className="cursor-pointer hover:bg-teal-600 p-2 rounded transition duration-150 ease-in-out">Previous Session 2</li>
          <li className="cursor-pointer hover:bg-teal-600 p-2 rounded transition duration-150 ease-in-out">Previous Session 3</li>
        </ul>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col bg-green-50">
        {/* Title */}
        <div className="bg-teal-600 text-white p-4 text-center">
          <h1 className="text-2xl font-bold">Serenity: Your Mental Health Companion</h1>
        </div>

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
                    ? 'bg-teal-500 text-white'
                    : 'bg-white text-gray-800 shadow-md'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="border-t border-teal-200 px-4 py-4 sm:mb-0 bg-green-100">
          <div className="relative flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-500 pl-4 bg-white rounded-md py-3"
            />
            <div className="absolute right-0 items-center inset-y-0 hidden sm:flex">
              <button
                onClick={handleSend}
                className="inline-flex items-center justify-center rounded-lg px-4 py-3 transition duration-500 ease-in-out text-white bg-teal-500 hover:bg-teal-400 focus:outline-none"
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