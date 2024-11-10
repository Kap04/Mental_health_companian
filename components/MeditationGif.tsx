import React from 'react';
import Meditate from '@/components/assets/meditate.gif'
import Image from 'next/image';

const MeditationGif = () => {
  return (
    <div className="flex flex-col w-72 h-auto items-center p-4 bg-white rounded-lg shadow-md">
      <Image 
        src={Meditate}
        alt="Meditation visualization"
        className="rounded-lg mb-4"
      />
      <p className="text-center text-gray-600 text-sm">
        Take a moment to practice mindful meditation
      </p>
    </div>
  );
};

export default MeditationGif;