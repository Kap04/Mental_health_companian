"use client"
import CrisisButton from '../../components/CrisisButton';
import React, { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Send, Volume2, VolumeX } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { addDoc, collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { firestoreDb } from "../../firebase";
import ChatSidebar from "../../components/Sidebar";
import Markdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Chatbot_logo from "../../components/assets/bot.png";
import MiddleLogo from "../../components/MiddleLogo"
import VoiceInput from '../../components/VoiceInput';
import BreathingCircle from "../../components/Breathing-circle"
import MeditationGif from '@/components/MeditationGif';
import WomensCrisisButton from '@/components/WomensCrisisButton';
import Navbar from '@/components/Navbar';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel(
  {
    model: "gemini-1.5-flash",
    // model: "tunedModels/mentalhealthbotreal-j61lbjfdj54k",
    systemInstruction: `You are a compassionate, non‑judgmental mental health companion whose purpose is to listen, validate, and support users through emotional challenges. Always prioritize empathy, respect, and user safety. 

When responding, follow these guidelines:
1. Active Listening:  
   – Reflect back what the user shares (“It sounds like…”).  
   – Validate feelings (“That must feel overwhelming”).  

2. Calming Strategies & Resources:  
   – Suggest evidence‑based coping tools (e.g., deep‑breathing, grounding exercises, mindfulness).  
   – Offer short, guided steps (“Let’s try a 4‑7‑8 breathing pattern together…”).  
   – Share links or hotline numbers only when appropriate (verify current country if needed).

3. Personalization & Inclusivity:  
   – Use “you” statements to make it personal (“You might find…”).  
   – Remain culturally sensitive and affirm diverse experiences.  
   – Avoid assumptions—ask clarifying questions when in doubt.

4. Crisis Awareness & Escalation:  
   – Watch for signs of severe distress (self‑harm ideation, suicidal thoughts).  
   – If you detect crisis language, immediately provide local/national crisis hotlines and encourage professional help.  
   – Example: “If you ever feel like you might harm yourself, please reach out to [your country’s crisis line] or dial emergency services right now. You are not alone.”

5. Confidentiality & Boundaries:  
   – Remind users: “I’m here to support, but I’m not a substitute for professional therapy.”  
   – Encourage seeking licensed mental health professionals for ongoing care.

6. Tone & Style:  
   – Warm, gentle, and patient.  
   – Concise—keep suggestions clear and to the point.  
   – Positive and hopeful, without minimizing struggles.

System Objective:  
Create a safe, affirming space where users feel truly heard, guided toward immediate coping strategies, and—when needed—directed to professional or crisis resources.
`,
    tools: [
      {
        googleSearchRetrieval: {
          dynamicRetrievalConfig: {
            mode: DynamicRetrievalMode.MODE_DYNAMIC,
            dynamicThreshold: 0.7,
          },
        },
      },
    ],  
  }
);

const MAX_HISTORY_LENGTH = 10;

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: { seconds: number };
}

const ChatPage: React.FC = () => {
  const { user, isSignedIn } = useUser();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatSession[]>([]);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isBotSpeechEnabled, setIsBotSpeechEnabled] = useState<boolean[]>([]);
  const [isVoiceInput, setIsVoiceInput] = useState(false);
  const [voiceInputMessage, setVoiceInputMessage] = useState('');
  const [showHeader, setShowHeader] = useState(true);
  const [showBreathingExercise, setShowBreathingExercise] = useState(false);
  const [showMeditation, setShowMeditation] = useState(false);


  useEffect(() => {
    if (isSignedIn && user?.id) {
      loadChatSessions(user.id);
    }
  }, [isSignedIn, user?.id]);

  const loadChatSessions = async (userId: string) => {
    try {
      const sessionsRef = collection(firestoreDb, 'userSessions', userId, 'sessions');
      const q = query(sessionsRef, orderBy('timestamp', 'desc'));
      onSnapshot(q, (querySnapshot) => {
        const sessions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
          timestamp: doc.data().timestamp
        }));
        setChatHistory(sessions);
      });
    } catch (error) {
      console.error("Error loading chat sessions:", error);
      setError("Failed to load chat sessions. Please try again.");
    }
  };

  const createNewSession = async (userId: string) => {
    try {
      const newSessionRef = await addDoc(collection(firestoreDb, 'userSessions', userId, 'sessions'), {
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
    if (!isSignedIn || !user?.id) return;
    try {
      setCurrentSessionId(sessionId);
      const messagesRef = collection(firestoreDb, 'userSessions', user.id, 'sessions', sessionId, 'messages');
      const q = query(messagesRef, orderBy('timestamp', 'asc'));
      onSnapshot(q, (querySnapshot) => {
        const chatMessages = querySnapshot.docs.map(doc => ({
          role: doc.data().role as 'user' | 'assistant',
          content: doc.data().content,
          timestamp: doc.data().timestamp.toDate()
        }));
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

  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript);
  };


  const handleDeleteChat = async (sessionId: string, confirmed: boolean = false) => {
    if (!isSignedIn || !user?.id) return;

    if (confirmed || window.confirm("Are you sure you want to delete this chat?")) {
      try {
        await deleteDoc(doc(firestoreDb, 'userSessions', user.id, 'sessions', sessionId));

        if (sessionId === currentSessionId) {
          createNewSession(user.id);
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
    if (!messageToSend.trim() || !isSignedIn || !user?.id) return;

    setShowHeader(false);

    const userMessage: Message = { role: 'user', content: messageToSend, timestamp: new Date() };

    setMessages((prev) => [...prev, userMessage]);
    setIsBotSpeechEnabled((prev) => [...prev, false]);
    setInput('');
    setVoiceInputMessage('');

    try {
      let sessionId = currentSessionId;
      let isNewSession = false;

      if (!sessionId) {
        const newSessionRef = await addDoc(collection(firestoreDb, 'userSessions', user.id, 'sessions'), {
          title: input.trim(),
          timestamp: new Date(),
        });
        sessionId = newSessionRef.id;
        setCurrentSessionId(sessionId);
        isNewSession = true;
      }

      await addDoc(collection(firestoreDb, 'userSessions', user.id, 'sessions', sessionId, 'messages'), userMessage);

      if (!isNewSession) {
        const sessionRef = doc(firestoreDb, 'userSessions', user.id, 'sessions', sessionId);
        const sessionDoc = await getDoc(sessionRef);
        const sessionData = sessionDoc.data();

        if (sessionData && sessionData.title === 'New Chat Session') {
          await updateDoc(sessionRef, { title: input.trim() });
        }
      }

      setIsLoading(true);
      const updatedHistory = [...conversationHistory, `Human: ${userMessage.content}`].slice(-MAX_HISTORY_LENGTH);
      const context = updatedHistory.join('\n');
      const result = await model.generateContent(context);
      const botResponse = result.response.text();
      
      //grounding 
      // if (result.response?.candidates && result.response.candidates.length > 0) {
      //   console.log(result.response.candidates[0].groundingMetadata);
      // } else {
      //   console.log("No candidates found in the response.");
      // }

      if (!botResponse) throw new Error('Invalid response from AI');

      const botMessage: Message = {
        role: 'assistant',
        content: botResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);

      setIsBotSpeechEnabled((prev) => [...prev, false]);
      setConversationHistory([...updatedHistory, `AI: ${botResponse}`].slice(-MAX_HISTORY_LENGTH));

      if (/breath(ing|s)?/i.test(botResponse.toLowerCase())) {
        setShowBreathingExercise(true);
      } else {
        setShowBreathingExercise(false);
      }

      // Add meditation check
      if (/meditat(e|ion|ing)/i.test(botResponse.toLowerCase())) {
        setShowMeditation(true);
      } else {
        setShowMeditation(false);
      }

      await addDoc(collection(firestoreDb, 'userSessions', user.id, 'sessions', sessionId, 'messages'), botMessage);

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
    <div>

      {/* <Navbar/> */}
    <div className="flex flex-col md:flex-row h-screen bg-[#FAF9F6]">
      <ChatSidebar
        onDeleteChat={handleDeleteChat}
        chatHistory={chatHistory}
        onSessionSelect={loadSession}
        onNewChat={() => isSignedIn && user?.id && createNewSession(user.id)}
      />

      <div className="flex-1 flex flex-col">
        <Navbar/>
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
                        : 'bg-[#F9F6EE] text-green-950 shadow-md'
                        }`}
                        >
                      <Markdown>{msg.role === 'assistant' ? msg.content.replace(/^Human:.*?\n/, '') : msg.content}</Markdown>
                    </div>
                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => toggleBotSpeech(index)}
                        className="mt-1 p-1 rounded-full bg-gray-200 hover:bg-gray-300"
                        aria-label={isBotSpeechEnabled[index] ? "Disable text-to-speech" : "Enable text-to-speech"}
                        >
                        {isBotSpeechEnabled[index] ? <Volume2 size={16} /> : <VolumeX size={16} />}
                      </button>
                    )}
                  </div>
                  {msg.role === 'assistant' && showBreathingExercise && index === messages.length - 1 && (
                    <div className="mt-4 ml-12">
                      <BreathingCircle />
                    </div>
                  )}
                  {msg.role === 'assistant' && showMeditation && index === messages.length - 1 && (
                    <div className="mt-4 ml-12">
                      <MeditationGif />
                    </div>
                  )}
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
          <WomensCrisisButton input={input} />
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
              <VoiceInput
                onTranscript={handleVoiceTranscript}
                setIsVoiceInput={setIsVoiceInput}
                setVoiceInputMessage={setVoiceInputMessage}
                />
              <button
                onClick={() => handleSend()}
                className="inline-flex items-center justify-center rounded-full p-2 transition duration-500 ease-in-out text-white bg-green-900 hover:bg-green-500 focus:outline-none"
                aria-label="Send message"
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
          </div>
  );
};

export default ChatPage;
