'use client'

import React, { useEffect, useState, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import { nanoid } from 'nanoid'

import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { Send } from "lucide-react"
import Markdown from "react-markdown"
import Navbar from "@/components/Navbar"
import Chatbot_logo from "../../components/assets/bot.png"; 
import { realtimeDb } from "@/firebase" 
import { ref, push, onValue, off, set } from 'firebase/database'

import { GoogleGenerativeAI } from "@google/generative-ai"

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
const genAI = new GoogleGenerativeAI(apiKey)
const model = genAI.getGenerativeModel({
  model: "tunedModels/mentalhealthbotreal-j61lbjfdj54k",
})

interface Message {
  id: string
  text: string
  userId: string
  username: string
  createdAt: number
  imageUrl?: string
}

export default function CommunityPage() {
  const { user, isSignedIn } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isSignedIn && user?.id) {
      const messagesRef = ref(realtimeDb, 'communityChat')

      const messageListener = onValue(messagesRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          const messageList = Object.entries(data).map(([id, message]: [string, any]) => ({
            id,
            ...message,
          }))
          messageList.sort((a, b) => a.createdAt - b.createdAt) 
          setMessages(messageList)
          scrollToBottom()
        }
      }, (error) => {
        console.error("Error in message listener:", error)
        setError('Failed to load messages. Please try again.')
      })

      return () => {
        off(messagesRef)
      }
    }
  }, [isSignedIn, user?.id])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !isSignedIn || !user?.id) return;
  
    setIsLoading(true);
    try {
      if (input.startsWith('@K-VRC ')) {
        const userMessage: Message = {
          id: nanoid(),
          text: input,
          userId: user.id,
          username: user.username || user.firstName || 'Anonymous',
          createdAt: Date.now(),
        };
  
        const aiResponse = await generateAIResponse(input.slice(6), messages);
        const aiMessage: Message = {
          id: nanoid(),
          text: aiResponse.text(),
          userId: 'ai',
          username: 'K-VRC',
          createdAt: Date.now(),
        };
  
        // Push both the user message and the AI response to Firebase
        await set(push(ref(realtimeDb, 'communityChat'), userMessage), userMessage);
        await set(push(ref(realtimeDb, 'communityChat'), aiMessage), aiMessage);
  
        setInput(''); // Clear input after message is sent
      } else {
        // Regular user message handling
        const messageData = {
          text: input,
          userId: user.id,
          username: user.username || user.firstName || 'Anonymous',
          imageUrl: user.imageUrl || '/placeholder.svg',
          createdAt: Date.now(),
        };
  
        await set(push(ref(realtimeDb, 'communityChat'), messageData), messageData);
        setInput(''); // Clear input after message is sent
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  

 

  const generateAIResponse = async (userInput: string, messages: Message[]) => {
    try {
      const context = messages.slice(-5).map((msg) => msg.text).join('\n')
      const response = await model.generateContent(`${context}\nUser: ${userInput}\nAI: `)
      return response.response
    } catch (error) {
      console.error('Error generating AI response:', error)
      throw error
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white">
    <Navbar />
    <header className="bg-white p-4 text-green-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold">Community Chat</h1>
      </div>
    </header>
    <main className="flex-grow overflow-y-auto p-4">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.userId === user?.id ? 'justify-start' : 'justify-start'}`}
            >
              <div className={`flex items-start max-w-[70%] ${message.userId === user?.id ? 'flex-row-reverse' : 'flex-row'}`}>
                {message.userId !== user?.id && (
                  <div className={`flex-shrink-0 ${message.userId === user?.id ? 'ml-2' : 'mr-2'}`}>
                    {/* Show K-VRC's profile picture */}
                    <Image
                      src={Chatbot_logo}
                      alt="K-VRC"
                      width={30}
                      height={30}
                      className="rounded-full"
                    />
                  </div>
                )}
                <div
                  className={`px-3 py-2 rounded-lg ${message.userId === user?.id
                      ? 'bg-green-700 text-gray-200'
                      : 'bg-white text-green-950 shadow-md'
                    } ${input.startsWith('@K-VRC ') ? 'opacity-60' : ''}`} // Apply transparency for @K-VRC input
                >
                  <p className="font-semibold text-sm">{message.username}</p>
                  <div className="text-base prose prose-sm max-w-none">
                    <Markdown>{message.text}</Markdown>
                  </div>
                  <p className="text-xs mt-1 opacity-75">
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
          {isLoading && (
            <div className="flex items-center space-x-2">
              <Image
                src="/placeholder.svg"
                alt="User"
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[160px] mt-2" />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
    <footer className="bg-white p-4 border-t">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={sendMessage} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message"
            className="w-full p-2 border rounded-md text-green-900"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
          >
            <Send />
          </button>
        </form>
      </div>
    </footer>
  </div>
  )
}
