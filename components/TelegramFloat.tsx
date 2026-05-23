'use client';

import { useState, useEffect } from 'react';

export default function TelegramFloat() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <a
      href="https://t.me/Kandydistro"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order via Telegram"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#8B7B2A] hover:bg-[#a08f30] text-white font-black px-6 py-4 rounded-lg shadow-xl transition-all duration-300 text-xs uppercase tracking-widest ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
      }`}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L8.32 14.617l-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.828.942z"/>
      </svg>
      Order Now
    </a>
  );
}