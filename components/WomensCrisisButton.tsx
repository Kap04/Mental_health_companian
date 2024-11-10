"use client";

import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface WomensCrisisButtonProps {
  input: string;
}

const WomensCrisisButton: React.FC<WomensCrisisButtonProps> = ({ input }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [isCallInitiated, setIsCallInitiated] = useState(false);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const assaultKeywords = [
      'assault',
      'attacked',
      'molested',
      'raped',
      'harassed',
      'stalked',
      'threatened',
      'domestic violence',
      'abuse',
      'violent partner',
      'unsafe'
    ];
    const inputLower = input.toLowerCase();
    const hasAssaultKeyword = assaultKeywords.some(keyword => inputLower.includes(keyword));
    setShowAlert(hasAssaultKeyword);
  }, [input]);

  const handleCrisisButtonClick = async () => {
    try {
      const response = await fetch('/api/initiateCall', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data: { callSid?: string; error?: string; message?: string } = await response.json();

      if (response.ok) {
        setIsCallInitiated(true);
        console.log('Call initiated:', data.callSid);
      } else {
        throw new Error(data.error || data.message || 'Unknown error');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error('Detailed error:', error.message);
        setError(error.message);
      } else {
        console.error('Unknown error:', error);
        setError('An unknown error occurred');
      }
    }
  };

  if (!showAlert) return null;

  return (
    <Alert variant="destructive" className="mb-4 border-4 border-red-500">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Women&apos;s Crisis Support Available</AlertTitle>
      <AlertDescription className="space-y-4">
        <div>
          If you&apos;re experiencing assault, abuse, or feel unsafe, immediate help is available. 
          You&apos;re not alone, and it&apos;s not your fault.
        </div>
        
        <div className="bg-white/10 p-3 rounded-md text-sm">
          • Available 24/7
          • Confidential support
          • Safe shelter information
          • Legal advocacy
          • Safety planning assistance
        </div>

        {!isCallInitiated ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleCrisisButtonClick}
              className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700 transition-colors flex-1"
            >
              Call Women&apos;s Crisis Helpline
            </button>
            <a
              href="https://www.thehotline.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors text-center flex-1"
            >
              Chat Online (Anonymous)
            </a>
          </div>
        ) : (
          <p className="mt-2 text-green-400">Call initiated. Help is connecting you with a crisis counselor.</p>
        )}
        
        {error && <p className="mt-2 text-red-500">Error: {error}</p>}
        
        
      </AlertDescription>
    </Alert>
  );
};

export default WomensCrisisButton;