"use client"
import React from 'react';
import Image from 'next/image';
import Navbar from "../components/Navbar";
import Gree from "../components/assets/gree.png";
import { SerenityCarousel } from "@/components/Caraousel";  // Import the custom carousel
import Link from 'next/link';
import Chatbot from "../components/assets/enhanced_bot-removebg-preview.png"
import { Bot, BrainCircuit, MessageSquareText, Shield, SunMoon, TriangleAlert } from 'lucide-react';


const features = [
  { text: "Chat anytime with our intelligent AI companion.", icon: BrainCircuit },
  { text: "Tailored discussions to suit your unique needs.", icon: MessageSquareText },
  { text: "Access support whenever you need it, day or night.", icon: SunMoon },
  { text: "Talk directly to the AI for a more personal experience.", icon: Bot },
  { text: "Your privacy is our priority; chat securely.", icon: Shield },
  { text: "Quick access to emergency hotlines and resources.", icon: TriangleAlert },
];

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-green-900 flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16">
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <Image
              src={Gree}
              alt="Serenity AI Companion"
              width={500}
              height={200}
              className="rounded-lg"
            />
          </div>
          <div className="w-full md:w-2/3 md:pl-12">
            <h1 className="text-4xl md:text-8xl font-bold text-white mb-6">
              Your AI Mental Health Companion
            </h1>
            <p className="text-xl text-green-100 mb-8">
              Feeling weighed down by anxiety, stress, or overwhelming emotions? You don't have to carry the burden alone. Our platform is designed to gently guide you through the toughest moments, helping you rediscover a sense of peace and balance. With compassionate support and personalized tools, take the first step towards a lighter, brighter you—because you deserve to feel free again.
            </p>
            <Link href='/chatpage' className="bg-white text-green-900 font-bold  py-3 px-6 rounded-full hover:bg-green-100 transition duration-300">
              Start Your Journey
            </Link>
          </div>
        </div>
        <section className="w-full h-screen">
          <SerenityCarousel />
        </section>
        <section className="relative h-screen bg-dark-green text-white overflow-hidden">
          {/* Features content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center z-10 px-8">
            <h2 className="text-8xl font-bold mb-12 text-center">Our Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mb-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-green-800 bg-opacity-80 p-4 text-xl rounded-lg shadow-md flex items-center">
                {feature.icon && (
                  <div className="mr-4">
                    <feature.icon className="w-8 h-8 text-white" /> {/* Render the actual icon */}
                  </div>
                )}
                <p>{feature.text}</p>
              </div>
              ))}
            </div>
            <Link  href="/chatpage" className="bg-[#C45508] text-white font-bold py-3 px-6 rounded-full text-xl hover:bg-black hover:text-[#ff9a52] hover:bg-opacity-90 transition-all duration-300">
              Try Our AI Companion Now
            </Link>
          </div>

          {/* Bot image */}
          <div className="absolute right-0 bottom-0 w-1/3 h-5/6">
            <Image
              src={Chatbot}
              alt="AI Chatbot"
              layout="fill"
              objectFit="contain"
              className="object-bottom"
            />
          </div>

          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark-green via-dark-green to-transparent z-0"></div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;