import React, { useEffect, useState } from 'react';

export const CursorGlow: React.FC = () => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!position) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 hidden lg:block"
      style={{
        background: `radial-gradient(650px circle at ${position.x}px ${position.y}px, rgba(59, 130, 246, 0.06), transparent 80%)`,
      }}
    />
  );
};
