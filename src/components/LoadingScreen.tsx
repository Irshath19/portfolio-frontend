import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu } from 'lucide-react';

interface LoadingScreenProps {
  onComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>([
    'INITIALIZING_GARAGE_KERNEL...',
  ]);
  const [progress, setProgress] = useState(25);

  useEffect(() => {
    const sequence = [
      'CONNECTING_TO_DATABASE_RELAYS...',
      'VERIFYING_SYSTEM_INTEGRITY...',
      'MOUNTING_WORKSHOP_CAPABILITIES...',
      'DEV.GARAGE_ONLINE.',
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < sequence.length) {
        const line = sequence[current];
        setLogs((prev) => [...prev, line]);
        setProgress(Math.min(100, (current + 2) * 20));
        current++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onComplete?.();
        }, 250);
      }
    }, 120);

    const fallbackTimeout = setTimeout(() => {
      clearInterval(interval);
      onComplete?.();
    }, 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(fallbackTimeout);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center p-6 font-mono text-xs text-text-secondary pointer-events-none"
      >
        <div className="w-full max-w-md space-y-4">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-accent">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              <span className="font-bold tracking-wider">DEV.GARAGE // BOOTLOADER</span>
            </div>
            <span className="text-text-muted">v3.0.0</span>
          </div>

          {/* Output Logs */}
          <div className="space-y-1.5 min-h-[90px]">
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-accent">&gt;</span>
                <span className={idx === logs.length - 1 ? 'text-accent-light font-bold' : 'text-text-muted'}>
                  {log}
                </span>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
            <div
              style={{ width: `${progress}%` }}
              className="h-full bg-accent transition-all duration-200"
            />
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};
