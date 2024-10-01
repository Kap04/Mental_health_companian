"use client";

import React, { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const CrisisButton = ({ input }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [isCallInitiated, setIsCallInitiated] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const suicideKeywords = ['suicide', 'kill myself', 'end my life', 'want to die'];
    const inputLower = input.toLowerCase();
    const hasSuicideKeyword = suicideKeywords.some(keyword => inputLower.includes(keyword));
    setShowAlert(hasSuicideKeyword);
  }, [input]);

  const handleCrisisButtonClick = async () => {
    try {
      const response = await fetch('/api/initiateCall', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (response.ok) {
        setIsCallInitiated(true);
        console.log('Call initiated:', data.callSid);
      } else {
        throw new Error(data.error || data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Detailed error:', error);
      setError(error.message);
    }
  };

  if (!showAlert) return null;

  return (
    <Alert variant="destructive" className="mb-4 border-4 ">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Crisis Support Available</AlertTitle>
      <AlertDescription>
        If you're having thoughts of suicide, please know that help is available.
        {!isCallInitiated ? (
          <button
            onClick={handleCrisisButtonClick}
            className="mt-2 bg-red-600 text-white px-4 py-2 ml-2 rounded hover:bg-red-700 transition-colors"
          >
            Call Suicide Helpline
          </button>
        ) : (
          <p className="mt-2 text-green-600">Call initiated. Help is on the way.</p>
        )}
        {error && <p className="mt-2 text-red-500">Error: {error}</p>}
      </AlertDescription>
    </Alert>
  );
};

export default CrisisButton;