"use client";  // Add this to make it a Client Component

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const LandingPage = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
      <header className="p-4 flex justify-between items-center bg-white shadow-md sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-blue-600">Serenity</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#home" className="text-blue-600 hover:text-blue-800">Home</a></li>
            <li><a href="#features" className="text-blue-600 hover:text-blue-800">Features</a></li>
            <li><a href="#about" className="text-blue-600 hover:text-blue-800">About</a></li>
            <li><a href="#contact" className="text-blue-600 hover:text-blue-800">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main className="flex-grow">
        <section id="home" className="text-center py-20 px-4 min-h-screen flex flex-col justify-center">
          <h2 className="text-5xl font-bold mb-6">Unlock Your Inner Serenity</h2>
          <p className="mb-8 text-xl max-w-2xl mx-auto">Your personal AI companion for mental wellness, available 24/7 to guide you towards a more balanced and fulfilling life.</p>
          <a href='/chatpage' className="bg-blue-500 text-white px-8 py-3 rounded-full hover:bg-blue-600 transition duration-300 text-lg">
            Chat Now
          </a>
        </section>

        <section id="features" className="bg-white py-20 px-4 min-h-screen flex flex-col justify-center">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-4xl font-bold mb-12 text-center">Discover the Power of Serenity</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { emoji: '🧘', title: 'Guided Meditation', description: 'Access a library of guided meditations tailored to your needs.' },
                { emoji: '💬', title: '24/7 Support', description: 'Chat with Serenity anytime, anywhere for instant support.' },
                { emoji: '📊', title: 'Progress Tracking', description: 'Monitor your mental wellness journey with intuitive insights.' },
              ].map((feature, index) => (
                <div key={index} className="text-center p-6 border rounded-lg shadow-lg">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-4xl">{feature.emoji}</span>
                  </div>
                  <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="py-20 px-4 min-h-screen flex flex-col justify-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-4xl font-bold mb-8 text-center">About Serenity</h3>
            <p className="text-lg mb-6">
              Serenity was created by a team of mental health professionals and AI experts. Our mission is to provide personalized, evidence-based support to help you navigate life's challenges and cultivate lasting inner peace.
            </p>
            <p className="text-lg mb-6">
              Using advanced AI, Serenity offers a unique blend of empathetic listening, guided exercises, and personalized recommendations. We're committed to your privacy and adhere to strict ethical guidelines in AI development and mental health support.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between">
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <h4 className="text-2xl font-bold mb-4">Serenity</h4>
            <p>Your AI companion for mental wellness</p>
          </div>
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <h5 className="font-semibold mb-4">Quick Links</h5>
            <ul className="space-y-2">
              <li><a href="#home" className="hover:text-blue-300">Home</a></li>
              <li><a href="#features" className="hover:text-blue-300">Features</a></li>
              <li><a href="#about" className="hover:text-blue-300">About Us</a></li>
              <li><a href="#contact" className="hover:text-blue-300">Contact</a></li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h5 className="font-semibold mb-4">Legal</h5>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-blue-300">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-300">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Floating Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300 z-50"
      >
        {isChatOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-xl z-50 flex flex-col">
          <div className="bg-blue-500 text-white p-4 rounded-t-lg">
            <h3 className="font-bold">Chat with Serenity</h3>
          </div>
          <div className="flex-grow p-4 overflow-y-auto">
            <p className="mb-2">Hello! How can I help you today?</p>
          </div>
          <div className="p-4 border-t">
            <input type="text" placeholder="Type your message..." className="w-full p-2 border rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;