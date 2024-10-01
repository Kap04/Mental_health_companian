import React from 'react';
import Link from 'next/link'; 
import Image from 'next/image';
import Logo from "../components/assets/logo.png"

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center justify-between bg-white shadow-md px-4 py-2">
      <div className="flex ml-10 items-center">
        <Image src={Logo} alt="Serenity Logo" width={32} height={32} />
        <span className="ml-2 text-xl text-green-950 font-bold">Serenity</span>
      </div>
      <div className="flex items-center pr-10 space-x-4">
        <Link href="/" className="text-green-950 hover:text-green-700">Home</Link>
        <Link href="/about" className="text-green-950 hover:text-green-700">About</Link>
        
        <Link href="/chatpage" className="bg-green-950 text-white text-sm px-4 py-2 rounded-full hover:bg-green-700">
          CHAT
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;