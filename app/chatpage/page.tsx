"use client"
import React, { useEffect, useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Send } from 'lucide-react';
import { auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, query, orderBy, onSnapshot, getDocs } from 'firebase/firestore';
import ChatSidebar from '../../components/Sidebar';
import Markdown from 'react-markdown';
import { Skeleton } from '@/components/ui/skeleton';
import VoiceInput from '../_component/VoiceInput';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "tunedModels/mentalhealthbotreal-j61lbjfdj54k" });

const ChatPage: React.FC = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);
    const [responseCount, setResponseCount] = useState(0);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [conversationHistory, setConversationHistory] = useState<string[]>([]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    await loadChatHistory(currentUser.uid);
                    await loadPreviousChats(currentUser.uid);
                } catch (error) {
                    console.error("Error loading chat history:", error);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    const loadChatHistory = async (userId: string) => {
        const q = query(collection(db, 'chatHistory', userId, 'messages'), orderBy('timestamp'));
        onSnapshot(q, (querySnapshot) => {
            const chatMessages = querySnapshot.docs.map(doc => doc.data());
            setMessages(chatMessages);
            // Update conversation history
            const history = chatMessages.map(msg => `${msg.role}: ${msg.content}`);
            setConversationHistory(history);
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
                // Update conversation history with the new user message
                const updatedHistory = [...conversationHistory, `Human: ${input}`];
                
                // Prepare the context for the AI
                const context = updatedHistory.join('\n');
                
                // Generate AI response with context
                const result = await model.generateContent(context);
                const botResponse = result.response.text();
                
                const botMessage = {
                    role: 'assistant',
                    content: botResponse,
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, botMessage]);
                
                // Update conversation history with the AI response
                setConversationHistory([...updatedHistory, `AI: ${botResponse}`]);
                
                if (user) {
                    await addDoc(collection(db, 'chatHistory', user.uid, 'messages'), botMessage);
                }
                speakResponse(botResponse);
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

    const handleVoiceInput = (transcript: string) => {
        setInput(transcript);
    };

    const speakResponse = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
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
                </div>

                <div className="w-full max-w-3xl pb-6 px-4">
                    {/* <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message here..."
                            className="w-full focus:outline-none focus:placeholder-gray-400 text-black placeholder-gray-500 pl-4 pr-20 py-3 rounded-full bg-white shadow-md"
                        />
                        <VoiceInput onTranscript={handleVoiceInput} />
                        <button
                            onClick={handleSend}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out text-white bg-[rgb(153,186,246)] hover:bg-[#E6D7FF] focus:outline-none"
                        >
                            <Send size={20} />
                        </button>
                    </div> */}
                    <div className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message here..."
                            className="w-full focus:outline-none focus:placeholder-gray-400 text-black placeholder-gray-500 pl-4 pr-20 py-3 rounded-full bg-white shadow-md"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                            <div
                                className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out text-white  focus:outline-none"
                            >
                                <VoiceInput onTranscript={handleVoiceInput} /> {/* Replace with your actual mic icon component */}
                            </div>
                            <button
                                onClick={handleSend}
                                className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out text-white bg-[rgb(153,186,246)] hover:bg-[#E6D7FF] focus:outline-none"
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>

                   

                </div>

                {error && <p className="text-red-500">{error}</p>}
            </div>
        </div>
    );
};

export default ChatPage;
