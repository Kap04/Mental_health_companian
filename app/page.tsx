
"use client"
import React from 'react';
import Image from 'next/image';
import Navbar from "../components/Navbar";
import Gree from "../components/assets/help.png";
import { SerenityCarousel } from "@/components/Caraousel";  // Import the custom carousel
import Link from 'next/link';
import Chatbot from "../components/assets/enhanced_bot-removebg-preview.png"
import { Bot, BrainCircuit, MessageSquareText, Shield, SunMoon, TriangleAlert } from 'lucide-react';
import Logo from "../components/assets/inverted_logo.png"


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
              Feeling weighed down by anxiety, stress, or overwhelming emotions? You don&apos;t have to carry the burden alone. Our platform is designed to gently guide you through the toughest moments, helping you rediscover a sense of peace and balance. With compassionate support and personalized tools, take the first step towards a lighter, brighter you—because you deserve to feel free again.
            </p>
            <Link href='/chatpage' className="bg-white text-green-900 font-bold  py-3 px-6 rounded-full hover:bg-green-950 hover:text-white transition duration-300">
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
            <Link href="/chatpage" className="bg-[#C45508] border-r-2 border-b-2 border-black text-white font-bold py-3 px-6 rounded-full text-xl hover:bg-black hover:text-[#ff9a52] hover:bg-opacity-90 transition-all duration-300">
              Try Our AI Companion Now
            </Link>
          </div>

          {/* Bot image */}
          <div className="absolute right-0 bottom-0 w-1/3 h-5/6">
            <Image
              src={Chatbot}
              alt="AI Chatbot"
              layout="fill"
              style={{ objectFit: 'cover' }}
              className="object-bottom"
            />
          </div>

          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark-green via-dark-green to-transparent z-0"></div>
        </section>

      </main>
      <footer className="bg-black text-white  w-full py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row">
          {/* Image section (1/4 width on larger screens) */}
          <div className="md:w-1/4 pl-20 mb-6 md:mb-0">
            <Image
              src={Logo}
              alt="Project Logo"
              width={200}
              height={200}
              className="rounded-lg"
            />
          </div>

          {/* Content section (3/4 width on larger screens) */}
          <div className="md:w-3/4 md:pl-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Project Info */}
              <div>
                <h3 className="text-xl font-bold mb-2">Serenity</h3>
                <p className="text-gray-300">Serenity AI is an intelligent mental health companion, uniquely designed to offer instant, personalized support through AI-powered conversations.</p>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-xl font-bold mb-2">Contact Us</h3>
                <p className="text-gray-300">Email: support@serenity-ai.com</p>
                <p className="text-gray-300">Phone: (123) 456-7890</p>
                <p className="text-gray-300">Address: 123 Project St, City, Country</p>
              </div>

              {/* Links */}
              <div>
                <h3 className="text-xl font-bold mb-2">Quick Links</h3>
                <ul>
                  <li className="mb-2">
                    <Link href="/chatpage" className="text-gray-300 hover:text-white transition-colors">
                      Chat Page
                    </Link>
                  </li>
                  {/* Add more links as needed */}
                </ul>
              </div>
            </div>

            {/* Copyright Notice */}
            <div className="mt-8 pt-4 border-t border-gray-700 text-center text-gray-400">
              © {new Date().getFullYear()} Project Name. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;