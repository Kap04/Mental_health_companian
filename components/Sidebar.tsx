import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Plus } from 'lucide-react';

interface ChatSidebarProps {
    chatHistory: any[]; // Can be more specific with a type if needed
    onSessionSelect: (sessionId: string) => void; // Changed to sessionId for clarity
    onNewChat: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ chatHistory, onSessionSelect, onNewChat }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative h-full bg-opacity-90">
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-green-900 text-white p-4 overflow-y-auto transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-64'
                }`}
            >
                <div className="h-full flex flex-col">
                    <h2 className="text-3xl pt-2 font-bold pl-4 mb-4">Chat History</h2>
                    <button
                        onClick={onNewChat}
                        className="mb-4 mt-4 flex text-sm items-center text-green-900 justify-center w-full py-2 bg-white hover:bg-black hover:text-white rounded-full transition duration-150 ease-in-out"
                    >
                        <Plus size={15} className="mr-2" />
                        New Chat
                    </button>
                    <ul className="space-y-2 flex-grow">
                        {chatHistory.map((chat) => (
                            <li
                                key={chat.id}
                                onClick={() => onSessionSelect(chat.id)} // Correctly uses the sessionId
                                className="cursor-pointer hover:bg-black p-2 rounded transition duration-150 ease-in-out"
                            >
                                {/* Display the chat title or fallback to a default message */}
                                <p className="font-normal text-sm">
                                    {chat.title || `Chat on ${new Date(chat.timestamp?.seconds * 1000).toLocaleString()}`}
                                </p>
                                {/* Optionally, display a human-readable date below the title */}
                                <p className="text-sm text-gray-300">
                                    {chat.timestamp ? new Date(chat.timestamp.seconds * 1000).toLocaleDateString() : 'No date'}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Toggle button for opening/closing the sidebar */}
            <div
                className="fixed top-1/2 left-0 -translate-y-1/2 transition-opacity duration-300 cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <ChevronLeft size={40} className="text-gray-500 hover:text-[#E6D7FF]" />
                ) : (
                    <ChevronRight size={40} className="text-gray-500 hover:text-[#E6D7FF]" />
                )}
            </div>
        </div>
    );
};

export default ChatSidebar;
