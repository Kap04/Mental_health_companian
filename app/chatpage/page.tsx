"use client"
import CrisisButton from '../../components/CrisisButton';  // Adjust the import path as needed
import React, { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, Volume2, VolumeX, Mic } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { addDoc, collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import ChatSidebar from "../../components/Sidebar";
import Markdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Chatbot_logo from "../../components/assets/bot.png";
import MiddleLogo from "../../components/MiddleLogo"

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "tunedModels/mentalhealthbotreal-j61lbjfdj54k" });

const MAX_HISTORY_LENGTH = 10;

const ChatPage: React.FC = () => {
  const { userId, isSignedIn } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [responseCount, setResponseCount] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isBotSpeechEnabled, setIsBotSpeechEnabled] = useState<boolean[]>([]);
  const [isVoiceInput, setIsVoiceInput] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceInputMessage, setVoiceInputMessage] = useState('');
  const [showHeader, setShowHeader] = useState(true);


  useEffect(() => {
    if (isSignedIn && userId) {
      loadChatSessions(userId);
      //createNewSession(userId);
    }
  }, [isSignedIn, userId]);

  const loadChatSessions = async (userId: string) => {
    try {
      const sessionsRef = collection(db, 'userSessions', userId, 'sessions');
      const q = query(sessionsRef, orderBy('timestamp', 'desc'));
      onSnapshot(q, (querySnapshot) => {
        const sessions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setChatHistory(sessions);
      });
    } catch (error) {
      console.error("Error loading chat sessions:", error);
      setError("Failed to load chat sessions. Please try again.");
    }
  };

  const createNewSession = async (userId: string) => {
    try {
      const newSessionRef = await addDoc(collection(db, 'userSessions', userId, 'sessions'), {
        title: conversationHistory[0] || 'New Chat Session',
        timestamp: new Date(),
      });
      setCurrentSessionId(newSessionRef.id);
      setMessages([]);
      setConversationHistory([]);
      setIsBotSpeechEnabled([]);
      setShowHeader(true)
    } catch (error) {
      console.error("Error creating new session:", error);
      setError("Failed to create a new chat session. Please try again.");
    }
  };

  const loadSession = async (sessionId: string) => {
    if (!isSignedIn || !userId) return;
    try {
      setCurrentSessionId(sessionId);
      const messagesRef = collection(db, 'userSessions', userId, 'sessions', sessionId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));
      onSnapshot(q, (querySnapshot) => {
        const chatMessages = querySnapshot.docs.map(doc => doc.data());
        setMessages(chatMessages);
        const history = chatMessages.map(msg => `${msg.role}: ${msg.content}`);
        setConversationHistory(history.slice(-MAX_HISTORY_LENGTH));
        setIsBotSpeechEnabled(new Array(chatMessages.length).fill(false));
        setShowHeader(false)
      });
    } catch (error) {
      console.error("Error loading session:", error);
      setError("Failed to load the chat session. Please try again.");
    }
  };

  const handleDeleteChat = async (sessionId: string, confirmed: boolean = false) => {
    if (!isSignedIn || !userId) return;

    if (confirmed || window.confirm("Are you sure you want to delete this chat?")) {
      try {
        // Delete the session document
        await deleteDoc(doc(db, 'userSessions', userId, 'sessions', sessionId));

        // If the deleted session was the current one, create a new session
        if (sessionId === currentSessionId) {
          createNewSession(userId);
        }

        console.log("Chat deleted successfully");
      } catch (error) {
        console.error("Error deleting chat:", error);
        setError("Failed to delete the chat. Please try again.");
      }
    }
  }

  const handleSampleInput = (sampleInput: string) => {
    setInput(sampleInput);
    setShowHeader(false);
    handleSend(sampleInput);
  };

  const handleSend = async (overrideInput?: string) => {
    const messageToSend = overrideInput || input;
    if (!messageToSend.trim() || !isSignedIn || !userId) return;

    setShowHeader(false);

    const userMessage = { role: 'user', content: messageToSend, timestamp: new Date() };

    setMessages((prev) => [...prev, userMessage]);
    setIsBotSpeechEnabled((prev) => [...prev, false]);
    setInput('');
    setVoiceInputMessage('');

    try {
        let sessionId = currentSessionId;
        let isNewSession = false;

        if (!sessionId) {
            // Create a new session if one doesn't exist
            const newSessionRef = await addDoc(collection(db, 'userSessions', userId, 'sessions'), {
                title: input.trim(), // Use the entire first message as the title
                timestamp: new Date(),
            });
            sessionId = newSessionRef.id;
            setCurrentSessionId(sessionId);
            isNewSession = true;
        }

        await addDoc(collection(db, 'userSessions', userId, 'sessions', sessionId, 'messages'), userMessage);

        // If it's not a new session, update the title with the first user input
        if (!isNewSession) {
            const sessionRef = doc(db, 'userSessions', userId, 'sessions', sessionId);
            const sessionDoc = await getDoc(sessionRef);
            const sessionData = sessionDoc.data();

            if (sessionData && sessionData.title === 'New Chat Session') {
                await updateDoc(sessionRef, { title: input.trim() });
            }
        }

        // Rest of the function remains the same...
        setIsLoading(true);
        const updatedHistory = [...conversationHistory, `Human: ${userMessage.content}`].slice(-MAX_HISTORY_LENGTH);
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
        setIsBotSpeechEnabled((prev) => [...prev, false]);
        setConversationHistory([...updatedHistory, `AI: ${botResponse}`].slice(-MAX_HISTORY_LENGTH));

        await addDoc(collection(db, 'userSessions', userId, 'sessions', sessionId, 'messages'), botMessage);

        if (isVoiceInput) {
            speakResponse(botResponse);
        }
    } catch (error) {
        console.error('Error in handleSend:', error);
        setError('Failed to send message or get a response. Please try again.');
        setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: 'Sorry, something went wrong.', timestamp: new Date() },
        ]);
        setIsBotSpeechEnabled((prev) => [...prev, false]);
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


const startVoiceInput = () => {
  setIsListening(true);
  setVoiceInputMessage('Listening...');

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    setVoiceInputMessage('Speech recognition is not supported in this browser.');
    setIsListening(false);
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    setInput(transcript);
    setIsVoiceInput(true);
    setVoiceInputMessage('');
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error', event.error);
    setVoiceInputMessage('Error in speech recognition. Please try again.');
    setIsListening(false);
  };

  recognition.onend = () => {
    setIsListening(false);
    if (!input) {
      setVoiceInputMessage('No speech detected. Please try again.');
    }
  };

  recognition.start();
};

const speakResponse = (text: string) => {
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
};

const toggleBotSpeech = (index: number) => {
  setIsBotSpeechEnabled((prev) => {
    const newState = [...prev];
    newState[index] = !newState[index];

    if (newState[index]) {
      speakResponse(messages[index].content);
    } else {
      window.speechSynthesis.cancel();
    }

    return newState;
  });
};

return (

  <div className="flex flex-col md:flex-row h-screen bg-[#FAF9F6]">
    <ChatSidebar
      onDeleteChat={handleDeleteChat}
      chatHistory={chatHistory}
      onSessionSelect={loadSession}
      onNewChat={() => isSignedIn && userId && createNewSession(userId)}
      className="w-full md:w-64 md:flex-shrink-0 border-r border-gray-200"
    />

    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col items-center overflow-hidden">
        {showHeader ? (
          <div className="flex-1 flex items-center justify-center w-full max-w-3xl p-4">
            <MiddleLogo onSampleInput={handleSampleInput} />
          </div>
        ) : (
          <div className="w-full max-w-3xl flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`flex items-start max-w-[80%] md:max-w-xl`}>
                  {msg.role === 'assistant' && (
                    <div className="flex-shrink-0 mr-2">
                      <Image
                        src={Chatbot_logo}
                        alt="Bot"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    </div>
                  )}
                  <div
                    className={`px-3 py-2 rounded-lg ${msg.role === 'user'
                        ? 'bg-green-900 text-white'
                        : 'bg-[#F9F6EE] text-green-900 shadow-md'
                      }`}
                  >
                    <Markdown>{msg.role === 'assistant' ? msg.content.replace(/^Human:.*?\n/, '') : msg.content}</Markdown>
                  </div>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => toggleBotSpeech(index)}
                      className="mt-1 p-1  rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                      {isBotSpeechEnabled[index] ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start items-start">
                <div className="flex-shrink-0 mr-2">
                  <Image
                    src={Chatbot_logo}
                    alt="Bot"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                </div>
                <div className="max-w-[80%] md:max-w-xl">
                  <Skeleton className="h-4 w-[150px] rounded-lg" />
                  <Skeleton className="h-3 w-[100px] rounded-lg mt-2" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl mx-auto pb-4 px-4">
        <CrisisButton input={input} />
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="w-full focus:outline-none focus:placeholder-gray-400 text-black placeholder-gray-400 pl-4 pr-20 py-3 rounded-full bg-white shadow-md"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            <button
              onClick={startVoiceInput}
              className={`p-2 rounded-full ${isListening ? 'bg-red-500' : 'bg-gray-200'} hover:bg-gray-300`}
            >
              <Mic size={20} />
            </button>
            <button
              onClick={handleSend}
              className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out text-white bg-green-900 hover:bg-green-500 focus:outline-none"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
        {voiceInputMessage && (
          <p className="text-blue-500 mt-2 text-sm">{voiceInputMessage}</p>
        )}
      </div>
    </div>

    {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
  </div>
);
};

export default ChatPage;