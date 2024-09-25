import React from 'react';
import { ChevronRight } from 'lucide-react';
import AuthForm from './_component/AuthForm';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5B5C2] via-[#E6D7FF] to-[#E0F7FA] text-black">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold">Serenity</div>
          <button className="bg-white text-black px-4 py-2 rounded-full hover:bg-[#F5B5C2] transition duration-300">
            Get Started
          </button>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold mb-6">Welcome to Serenity</h1>
        <p className="text-xl mb-8">Your Personal Mental Health Companion</p>
        
        <div className="mb-12">
          <img 
            src="/api/placeholder/200/200" 
            alt="Serenity Chatbot Icon" 
            className="mx-auto rounded-full border-4 border-white shadow-lg"
          />
        </div>

        <p className="text-lg mb-8">
          Serenity is here to listen, support, and guide you on your journey to better mental health.
          Our AI-powered chatbot offers a safe space for you to express yourself and find the help you need.
        </p>

        {/* <AuthForm /> */}

        <a 
          href="/chatpage" 
          className="inline-flex items-center bg-white text-black px-6 py-3 rounded-full text-lg font-semibold hover:bg-[#F5B5C2] transition duration-300 mt-8"
        >
          Start Chatting Now
          <ChevronRight className="ml-2" />
        </a>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center">
        <p>&copy; 2024 Serenity. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;