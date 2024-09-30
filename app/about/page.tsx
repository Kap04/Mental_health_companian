

import React from 'react';
import Image from 'next/image';
import Head from 'next/head'
import Blu from "../../components/assets/hap.png"
import Navbar from '@/components/Navbar';

const AboutPage: React.FC = () => {
  return (
    <>
      <Navbar />
      <Head>
        <title>About Serenity AI</title>
        <meta name="description" content="Learn about Serenity AI, your compassionate AI companion for emotional wellness" />
      </Head>
      <div className="min-h-screen bfg-white text-dark-green relative overflow-hidden">
            <div className="absolute left-7 bottom-0 w-1/3 h-2/3 lg:w-1/4 lg:h-3/4">
              <Image
                src={Blu}
                alt="Serenity AI Bot giving a blue flower"
                layout="fill"
                objectFit="contain"
                className="object-bottom"
                priority={true}
              />
            </div>
        <main className="container mx-auto px-4 py-16 flex flex-col items-center">
          <div className="max-w-3xl text-center">
            <h1 className="text-9xl font-bold mb-8">About Us</h1>
            <p className="mb-6 text-2xl">
              Welcome to <em>Serenity AI</em>, where technology meets emotional wellness. In today's fast-paced world, mental well-being can often take a backseat. That's why we created Serenity AI—a compassionate AI companion designed to be there for you whenever you need it.
            </p>
            <p className="mb-6 text-2xl">
              At the heart of our mission is a simple idea: everyone deserves someone to talk to, especially in tough moments. Whether you're facing anxiety, stress, or just need to unwind, our AI is here to guide you with calm, thoughtful conversations. It offers a sense of relief, like receiving a moment of peace when you need it most.
            </p>
            {/* <h2 className="text-3xl font-semibold mt-12 mb-6">Why Serenity AI?</h2>
            <p className="mb-6 text-lg">
              Serenity AI is more than just a chatbot. It's a companion that listens, understands, and provides tailored support without judgment. Whether through text or voice, Serenity adapts to your preferences, helping you regain balance when life feels overwhelming.
            </p>
            <p className="mb-6 text-lg">
              Our goal is to make emotional support accessible, immediate, and available anytime—day or night. So, whenever you need a moment of calm, Serenity AI is here to help you feel lighter, more connected, and at peace.
            </p> */}
          </div>
        </main>
      </div>
    </>
  );
};

export default AboutPage;