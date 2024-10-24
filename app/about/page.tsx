

import React from 'react';
import Image from 'next/image';
import Head from 'next/head'
import Blu from "../../components/assets/hap.png"
import Navbar from '@/components/Navbar';
import VoiceInput  from '../_component/VoiceInput';

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
              Welcome to <em>Serenity AI</em>, where technology meets emotional wellness. In today&apos;s fast-paced world, mental well-being can often take a backseat. That&apos;s why we created Serenity AI—a compassionate AI companion designed to be there for you whenever you need it.
            </p>
            <p className="mb-6 text-2xl">
              At the heart of our mission is a simple idea: everyone deserves someone to talk to, especially in tough moments. Whether you&apos;re facing anxiety, stress, or just need to unwind, our AI is here to guide you with calm, thoughtful conversations. It offers a sense of relief, like receiving a moment of peace when you need it most.
            </p>
            
          </div>
        </main>
      </div>
    </>
  );
};

export default AboutPage;