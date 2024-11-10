'use client'

import React, { useEffect, useState, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import { ref, push, onValue, off, set, getDatabase } from 'firebase/database'
import { db } from "@/firebase"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { Send } from "lucide-react"
import Markdown from "react-markdown"
import Navbar from "@/components/Navbar"

interface Message {
  id: string
  text: string
  userId: string
  username: string
  createdAt: number
  imageUrl?: string
}



// Add this at the top level of your component to verify database connection
const database = getDatabase();
console.log("Database initialization:", database);

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
      const messagesRef = ref(db, 'communityChat')

      onValue(messagesRef, (snapshot) => {
        const data = snapshot.val()
        if (data) {
          const messageList = Object.entries(data).map(([id, message]: [string, any]) => ({
            id,
            ...message,
          }))
          // Sort messages by timestamp
          messageList.sort((a, b) => a.createdAt - b.createdAt)
          setMessages(messageList)
          scrollToBottom()
        }
      })

      return () => {
        // Cleanup subscription
        off(ref(db, 'communityChat'))
      }
    }
  }, [isSignedIn, user?.id])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !isSignedIn || !user?.id) return

    setIsLoading(true)
    try {
      const messagesRef = ref(database, 'communityChat')
      const messageData = {
        text: input,
        userId: user.id,
        username: user.username || user.firstName || 'Anonymous',
        imageUrl: user.profileImageUrl || "./placeholder", // Add this line to include Clerk profile image
        createdAt: Date.now(),
      };

      const newMessageRef = push(messagesRef)
      await set(newMessageRef, messageData)
      setInput('')
    } catch (error) {
      console.error('Error in sendMessage:', error)
      setError('Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Add this useEffect to verify message listening is working
  useEffect(() => {
    if (isSignedIn && user?.id) {
      console.log("Setting up message listener");
      const messagesRef = ref(database, 'communityChat');

      onValue(messagesRef, (snapshot) => {
        console.log("Message data received:", snapshot.val());
        const data = snapshot.val();
        if (data) {
          const messageList = Object.entries(data).map(([id, message]: [string, any]) => ({
            id,
            ...message,
          }));
          console.log("Processed message list:", messageList);
          setMessages(messageList);
        }
      }, (error) => {
        console.error("Error in message listener:", error);
      });

      return () => {
        console.log("Cleaning up message listener");
        off(messagesRef);
      };
    }
  }, [isSignedIn, user?.id]);

  // Add a form submission debug
  const handleFormSubmit = (e: React.FormEvent) => {
    console.log("Form submission started");
    sendMessage(e);
  };

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
              <div key={message.id} className="flex justify-start">
                <div className={`flex items-start max-w-[70%]`}>
                  {message.userId !== user?.id && (
                    <div className="flex-shrink-0 mr-2">
                      <Image
                        src={message.imageUrl || "/placeholder.svg"}
                        alt={message.username}
                        width={30}
                        height={30}
                        className="rounded-full"
                        unoptimized
                      />
                    </div>
                  )}
                  <div
                    className={`px-3 py-2 rounded-lg ${
                      message.userId === user?.id 
                        ? 'bg-green-700 text-gray-200' 
                        : 'bg-white text-green-950 shadow-md'
                    }`}
                  >
                    <p className="font-semibold text-xs">{message.username}</p>
                    <p className="text-base"><Markdown>{message.text}</Markdown></p>
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
      <footer className="bg-white p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleFormSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="w-full focus:outline-none focus:placeholder-gray-400 text-black placeholder-gray-400 pl-4 pr-20 py-3 rounded-full bg-white shadow-md"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out text-white bg-green-900 hover:bg-green-700 focus:outline-none"
              disabled={isLoading}
            >
              <Send size={20} />
            </button>
          </form>
          {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
        </div>
      </footer>
    </div>
  )
}