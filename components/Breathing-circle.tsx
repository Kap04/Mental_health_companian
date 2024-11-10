import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BreathingCircle() {
  const [phase, setPhase] = useState<'in' | 'hold' | 'out'>('in');
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    let startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      
      if (phase === 'in' && elapsed < 4000) {
        setProgress(elapsed / 4000);
      } else if (phase === 'in') {
        setPhase('hold');
        startTime = now;
      } else if (phase === 'hold' && elapsed < 2000) {
        setProgress(1);
      } else if (phase === 'hold') {
        setPhase('out');
        startTime = now;
      } else if (phase === 'out' && elapsed < 4000) {
        setProgress(1 - elapsed / 4000);
      } else if (phase === 'out') {
        setPhase('in');
        startTime = now;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [phase]);

  return (
    <div className="relative w-64 h-64 flex items-center justify-center bg-green-950 rounded-lg">
      {/* Background circle */}
      <div className="absolute w-48 h-48 rounded-full border-2 border-emerald-700" />
      
      {/* Animated progress circle */}
      <svg className="absolute w-48 h-48 -rotate-90">
        <circle
          cx="96"
          cy="96"
          r="92"
          stroke="currentColor"
          strokeWidth="6"
          fill="none"
          className="text-zinc-200"
          strokeDasharray={`${progress * 289} 289`}
          strokeLinecap="round"
        />
      </svg>

      {/* Animated dot */}
      <motion.div
        className="absolute w-3 h-3 rounded-full bg-orange-600"
        style={{
          rotate: progress * 360 - 90,
          //radius: 10,
          translateX: 96,
          transformOrigin: '-92px 0',
        }}
        animate={{
          scale: phase === 'hold' ? 1.1 : 1
        }}
        transition={{
          duration: 0.5
        }}
      />

      {/* Text in center */}
      <AnimatePresence mode="wait">
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="text-center text-zinc-200"
        >
          <div className="text-2xl font-medium mb-1">
            {phase === 'in' ? 'Breathe In' : phase === 'hold' ? 'Hold' : 'Breathe Out'}
          </div>
          <div className="text-lg text-zinc-400">
            {phase === 'in' ? '4s' : phase === 'hold' ? '2s' : '4s'}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}