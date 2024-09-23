import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';


const ChatSidebar = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative h-full">
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-black bg-opacity-50 text-white p-4 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isHovered ? 'translate-x-0' : '-translate-x-64'
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="h-full flex flex-col">
          <h2 className="text-xl font-bold mb-4">Chat History</h2>
          <ul className="space-y-2 flex-grow">
            <li className="cursor-pointer hover:bg-[#F5B5C2] p-2 rounded transition duration-150 ease-in-out">Previous Session 1</li>
            <li className="cursor-pointer hover:bg-[#F5B5C2] p-2 rounded transition duration-150 ease-in-out">Previous Session 2</li>
            <li className="cursor-pointer hover:bg-[#F5B5C2] p-2 rounded transition duration-150 ease-in-out">Previous Session 3</li>
          </ul>
        </div>
      </div>
      <div 
        className={`fixed top-1/2 left-0 -translate-y-1/2 transition-opacity duration-300 ${
          isHovered ? 'opacity-0' : 'opacity-100'
        }`}
        onMouseEnter={() => setIsHovered(true)}
      >
        <ChevronRight 
          size={24} 
          className="text-[#F5B5C2] cursor-pointer hover:text-[#E6D7FF]"
        />
      </div>
    </div>
  );
};

export default ChatSidebar;