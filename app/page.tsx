"use client"
import React from 'react';
import Image from 'next/image';
import Navbar from "../components/Navbar";  
import Gree from "../components/assets/gree.png";
import { SerenityCarousel } from "@/components/Caraousel";  // Import the custom carousel
import Link from 'next/link';


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
            <Link href='/chatpage'  className="bg-white text-green-900 font-bold  py-3 px-6 rounded-full hover:bg-green-100 transition duration-300">
              Start Your Journey
            </Link>
          </div>
        </div>
      <section className="w-full h-screen">
        <SerenityCarousel />
      </section>
      </main>
    </div>
  );
};

export default LandingPage;