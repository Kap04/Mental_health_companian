"use client"
import React, { useEffect, useState, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Send } from 'lucide-react';
import { auth } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import ChatSidebar from '../_component/Sidebar';
import Markdown from 'react-markdown';
import { Skeleton } from '@/components/ui/skeleton'; 

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const ChatPage: React.FC = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [responseCount, setResponseCount] = useState(0);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                loadChatHistory(currentUser.uid);
                loadPreviousChats(currentUser.uid);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const loadChatHistory = (userId: string) => {
        const q = query(collection(db, 'chatHistory', userId, 'messages'), orderBy('timestamp'));
        onSnapshot(q, (querySnapshot) => {
            const chatMessages = querySnapshot.docs.map(doc => doc.data());
            setMessages(chatMessages);
        });
    };

    const loadPreviousChats = async (userId: string) => {
        const chatsRef = collection(db, 'chatHistory', userId, 'chats');
        const querySnapshot = await getDocs(chatsRef);
        const chats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChatHistory(chats);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');

        if (user || responseCount < 5) {
            const messageData = {
                role: 'user',
                content: input,
                timestamp: new Date(),
            };

            if (user) {
                await addDoc(collection(db, 'chatHistory', user.uid, 'messages'), messageData);
            } else {
                setResponseCount(prevCount => prevCount + 1);
            }

            setIsLoading(true);
            try {
                const result = await model.generateContent(input);
                const botMessage = {
                    role: 'assistant',
                    content: result.response.text(),
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, botMessage]);
                if (user) {
                    await addDoc(collection(db, 'chatHistory', user.uid, 'messages'), botMessage);
                }
            } catch (error) {
                console.error('Error generating content:', error);
                setMessages((prev) => [
                    ...prev,
                    { role: 'assistant', content: 'Sorry, something went wrong.', timestamp: new Date() },
                ]);
            } finally {
                setIsLoading(false);
            }
        } else {
            setError('Message limit reached. Please sign in to continue.');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    return (
        <div className="flex h-screen bg-gradient-to-b from-[#e0eafc] to-[#cfdef3]">
            <ChatSidebar chatHistory={chatHistory} />

            <div className="flex-1 flex flex-col items-center">
                <div className="w-full max-w-3xl flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-xl px-4 py-2 rounded-lg ${
                                    msg.role === 'user'
                                        ? 'bg-white text-black'
                                        : 'bg-white text-black shadow-md'
                                }`}
                            >
                                <Markdown>{msg.content}</Markdown>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="max-w-xl">
                                <Skeleton className="h-6 w-[200px] rounded-lg" />
                                <Skeleton className="h-4 w-[150px] rounded-lg mt-2" />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

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
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out text-white bg-[rgb(153,186,246)] hover:bg-[#E6D7FF] focus:outline-none"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>

                {error && <p className="text-red-500">{error}</p>}
            </div>
        </div>
    );
};

export default ChatPage;