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
    <div className="relative h-full">
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-green-950 bg-opacity-80 text-white p-4 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <div className="h-full flex flex-col">
          <h2 className="text-xl font-bold mb-4">Chat History</h2>
          <ul className="space-y-2 flex-grow">
            {chatHistory.map((chat, index) => (
              <li key={chat.id} className="cursor-pointer hover:bg-[#F5B5C2] p-2 rounded transition duration-150 ease-in-out">
                Chat Session {index + 1}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div 
        className={`fixed top-1/2 left-0 -translate-y-1/2 transition-opacity duration-300 ${
          isOpen ? 'opacity-0' : 'opacity-100'
        }`}
        onMouseEnter={() => setIsOpen(true)}
      >
        <ChevronRight 
          size={40} 
          className="text-gray-500 cursor-pointer hover:text-[#E6D7FF]"
        />
      </div>
    </div>
  );
};

export default ChatSidebar;
