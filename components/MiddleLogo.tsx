// import React from 'react';
// import Image from 'next/image';
// import { Button } from '@/components/ui/button';
// import Logo from "../components/assets/logo.png"
// import { HeartPulse, MessageSquare, Shield, Wind } from 'lucide-react';

// const Header = () => {
//   return (
//     <div className="w-full p-4">
//       <div className="max-w-3xl mx-auto flex flex-col items-center">
//         <div className="mb-4">
//           <Image
//             src={Logo} // Replace with your actual logo path
//             alt="Logo"
//             width={120}
//             height={120}
//           />
//         </div>
//         <div className="grid grid-cols-2 gap-2 w-full max-w-xl">
//           <Button variant="outline" className="text-black border-white shadow-md hover:bg-gray-200">
//             <Wind className='text-blue-500 pr-2 ' />
//             Help me relax
//           </Button>
//           <Button variant="outline" className="text-black border-white shadow-md hover:bg-gray-200">
//             <MessageSquare className='text-yellow-700 pr-2'/>
//             I need to talk
//           </Button>
//           <Button variant="outline" className="text-black border-white shadow-md hover:bg-gray-200">
//             <HeartPulse className='text-red-700 pr-2' />
//             I'm feeling anxious
//           </Button>
//           <Button variant="outline" className="text-black border-white shadow-md hover:bg-gray-200">
//             <Shield  className='text-green-500 pr-2' />

//             I'm scared about something
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Header;

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Logo from "../components/assets/logo.png"
import { HeartPulse, MessageSquare, Shield, Wind } from 'lucide-react';

interface HeaderProps {
  onSampleInput: (input: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSampleInput }) => {
  const handleButtonClick = (input: string) => {
    onSampleInput(input);
  };

  return (
    <div className="w-full p-4">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <div className="mb-4">
          <Image
            src={Logo}
            alt="Logo"
            width={120}
            height={120}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 w-full max-w-xl">
          <Button 
            variant="outline" 
            className="text-black border-white shadow-md hover:bg-gray-200"
            onClick={() => handleButtonClick("I need help relaxing. Can you suggest some techniques?")}
          >
            <Wind className='text-blue-500 pr-2 ' />
            Help me relax
          </Button>
          <Button 
            variant="outline" 
            className="text-black border-white shadow-md hover:bg-gray-200"
            onClick={() => handleButtonClick("I need someone to talk to. Can we have a conversation?")}
          >
            <MessageSquare className='text-yellow-700 pr-2'/>
            I need to talk
          </Button>
          <Button 
            variant="outline" 
            className="text-black border-white shadow-md hover:bg-gray-200"
            onClick={() => handleButtonClick("I'm feeling anxious. What can I do to calm down?")}
          >
            <HeartPulse className='text-red-700 pr-2' />
            I'm feeling anxious
          </Button>
          <Button 
            variant="outline" 
            className="text-black border-white shadow-md hover:bg-gray-200"
            onClick={() => handleButtonClick("I'm scared about something. Can you help me work through it?")}
          >
            <Shield  className='text-green-500 pr-2' />
            I'm scared about something
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;