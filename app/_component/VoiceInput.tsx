import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
}

// Define the SpeechRecognition type
type SpeechRecognition = any;

// Define the SpeechRecognitionEvent type
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        setRecognition(recognitionInstance);
      }
    }
  }, []);

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => (result as SpeechRecognitionResult)[0].transcript)
        .join(' ');
      onTranscript(transcript);
    };

    recognition.onerror = (event: { error: any }) => {
      console.error('Speech recognition error', event.error);
    };

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
    };
  }, [recognition, onTranscript]);

  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
    } else {
      recognition?.start();
    }
    setIsListening(!isListening);
  };

  return (
    <button
      onClick={toggleListening}
      className="p-2 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      aria-label={isListening ? 'Stop listening' : 'Start listening'}
    >
      {isListening ? (
        <MicOff className="h-5 w-5 text-red-500" />
      ) : (
        <Mic className="h-5 w-5 text-gray-500" />
      )}
    </button>
  );
};

export default VoiceInput;