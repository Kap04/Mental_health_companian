"use client";

import React, { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send } from "lucide-react";
import { auth, db } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { addDoc, collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc } from "firebase/firestore";
import ChatSidebar from "../../components/Sidebar";
import Markdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";
import VoiceInput from "../_component/VoiceInput";
import Chatbot_logo from "../../components/assets/bot.png"
import Image from "next/image";



const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "tunedModels/mentalhealthbotreal-j61lbjfdj54k" });

const MAX_HISTORY_LENGTH = 10;

const ChatPage: React.FC = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [responseCount, setResponseCount] = useState(0);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [conversationHistory, setConversationHistory] = useState<string[]>([]);
    const [isVoiceInput, setIsVoiceInput] = useState(false);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    await loadChatSessions(currentUser.uid);
                    createNewSession(currentUser.uid);
                } catch (error) {
                    console.error("Error loading chat sessions:", error);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    const loadChatSessions = async (userId: string) => {
        const sessionsRef = collection(db, 'userSessions', userId, 'sessions');
        const q = query(sessionsRef, orderBy('timestamp', 'desc'));
        onSnapshot(q, (querySnapshot) => {
            const sessions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setChatHistory(sessions);
        });
    };

    const createNewSession = async (userId: string) => {
        const newSessionRef = await addDoc(collection(db, 'userSessions', userId, 'sessions'), {
            title: 'New Chat Session', // Temporary title until first message
            timestamp: new Date(),
        });
        setCurrentSessionId(newSessionRef.id);
        setMessages([]);
        setConversationHistory([]);
    };

    const loadSession = async (sessionId: string) => {
        if (!user) return;
        setCurrentSessionId(sessionId);
        const messagesRef = collection(db, 'userSessions', user.uid, 'sessions', sessionId, 'messages');
        const q = query(messagesRef, orderBy('timestamp', 'asc'));
        onSnapshot(q, (querySnapshot) => {
            const chatMessages = querySnapshot.docs.map(doc => doc.data());
            setMessages(chatMessages);
            const history = chatMessages.map(msg => `${msg.role}: ${msg.content}`);
            setConversationHistory(history.slice(-MAX_HISTORY_LENGTH));
        });
    };

    const handleSend = async () => {
        if (!input.trim() || !currentSessionId) return;

        const userMessage = { role: 'user', content: input, timestamp: new Date() };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');

        if (user) {
            await addDoc(collection(db, 'userSessions', user.uid, 'sessions', currentSessionId, 'messages'), userMessage);

            const sessionRef = doc(db, 'userSessions', user.uid, 'sessions', currentSessionId);
            const sessionDoc = await getDoc(sessionRef);
            const sessionData = sessionDoc.data();

            if (sessionData && sessionData.title === 'New Chat Session') {
                await updateDoc(sessionRef, { title: input.slice(0, 50) });
            }
        } else {
            setResponseCount(prevCount => prevCount + 1);
        }

        setIsLoading(true);
        try {
            const updatedHistory = [...conversationHistory, `Human: ${input}`].slice(-MAX_HISTORY_LENGTH);
            const context = updatedHistory.join('\n');
            const result = await model.generateContent(context);
            const botResponse = result.response.text();

            if (!botResponse) throw new Error('Invalid response from AI');

            const botMessage = {
                role: 'assistant',
                content: botResponse,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
            setConversationHistory([...updatedHistory, `AI: ${botResponse}`].slice(-MAX_HISTORY_LENGTH));

            if (user) {
                await addDoc(collection(db, 'userSessions', user.uid, 'sessions', currentSessionId, 'messages'), botMessage);
            }
            if (isVoiceInput) {
                speakResponse(botResponse);
            }
        } catch (error) {
            console.error('Error generating content:', error);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: 'Sorry, something went wrong.', timestamp: new Date() },
            ]);
        } finally {
            setIsLoading(false);
            setIsVoiceInput(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setIsVoiceInput(false);
            handleSend();
        }
    };

    const handleVoiceInput = (transcript: string) => {
        setInput(transcript);
        setIsVoiceInput(true);
    };

    const speakResponse = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="flex h-screen bg-[#FAF9F6]">
            <ChatSidebar
                chatHistory={chatHistory}
                onSessionSelect={loadSession}
                onNewChat={() => createNewSession(user.uid)}
            />

            <div className="flex-1 flex flex-col items-center">
                <div className="w-full max-w-3xl flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {msg.role === 'assistant' && (
                                <div className="flex-shrink-0  mr-2">
                                    <Image
                                        src={Chatbot_logo}
                                        alt="Bot"
                                        width={64}
                                        height={64}
                                        className="rounded-full pr-2"
                                    />
                                </div>
                            )}
                            <div
                                className={`max-w-xl px-4 py-2 rounded-lg ${msg.role === 'user'
                                        ? 'bg-green-900 text-white'
                                        : 'bg-[#F9F6EE] text-green-900 shadow-md'
                                    }`}
                            >
                                <Markdown>{msg.content}</Markdown>
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex-shrink-0 mr-2">
                                <Image
                                    src={Chatbot_logo}
                                    alt="Bot"
                                    width={64}
                                    height={64}
                                    className="rounded-full pr-2"
                                />
                            </div>
                            <div className="max-w-xl">
                                <Skeleton className="h-6 w-[200px] rounded-lg" />
                                <Skeleton className="h-4 w-[150px] rounded-lg mt-2" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-full max-w-3xl pb-6 px-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message here..."
                            className="w-full focus:outline-none focus:placeholder-gray-400 text-black placeholder-gray-400 pl-4 pr-20 py-3 rounded-full bg-white shadow-md"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                            <div
                                className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out text-white focus:outline-none"
                            >
                                <VoiceInput onTranscript={handleVoiceInput} />
                            </div>
                            <button
                                onClick={handleSend}
                                className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out text-white bg-green-900  hover:bg-green-500 focus:outline-none"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                {error && <p className="text-orange-500">{error}</p>} {/* Softer error color */}
            </div>
        </div>
    );
};

export default ChatPage;
