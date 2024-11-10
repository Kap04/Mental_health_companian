'use client'

import React, { useEffect, useState, useRef } from "react"
import { useUser } from "@clerk/nextjs"

import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { Send } from "lucide-react"
import Markdown from "react-markdown"
import Navbar from "@/components/Navbar"


import { realtimeDb } from "@/firebase"  // Update this import
import { ref, push, onValue, off, set } from 'firebase/database'

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

      // Add authentication token to database requests
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
    e.preventDefault()
    if (!input.trim() || !isSignedIn || !user?.id) return

    setIsLoading(true)
    try {
      const messagesRef = ref(realtimeDb, 'communityChat')
      const messageData = {
        text: input,
        userId: user.id,
        username: user.username || user.firstName || 'Anonymous',
        imageUrl: user.imageUrl || "/placeholder.svg",
        createdAt: Date.now(),
      }

      const newMessageRef = push(messagesRef)
      await set(newMessageRef, messageData)
      setInput('')
    } catch (error) {
      console.error('Error sending message:', error)
      setError('Failed to send message. Please try again.')
    } finally {
      setIsLoading(false)
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
                className={`flex ${message.userId === user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start max-w-[70%] ${message.userId === user?.id ? 'flex-row-reverse' : 'flex-row'}`}>
                  {message.userId !== user?.id && (
                    <div className={`flex-shrink-0 ${message.userId === user?.id ? 'ml-2' : 'mr-2'}`}>
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
                    className={`px-3 py-2 rounded-lg ${message.userId === user?.id
                        ? 'bg-green-700 text-gray-200'
                        : 'bg-white text-green-950 shadow-md'
                      }`}
                  >
                    <p className="font-semibold text-xs">{message.username}</p>
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
              placeholder="Type your message..."
              className="w-full focus:outline-none focus:placeholder-gray-400 text-black placeholder-gray-400 pl-4 pr-20 py-3 rounded-full bg-white shadow-md"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out text-white bg-green-900 hover:bg-green-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              <Send size={20} />
            </button>
          </form>
          {error && (
            <p className="text-red-500 mt-2 text-sm text-center">{error}</p>
          )}
        </div>
      </footer>
    </div>
  )
}