"use client";

import { useEffect, useState } from "react";

export function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex items-center gap-4 text-white">
      <div className="flex flex-col items-center">
        <span className="text-3xl font-bold">{String(timeLeft.days).padStart(2, '0')}</span>
        <span className="text-[10px] uppercase tracking-wider text-white/70">Day</span>
      </div>
      <span className="text-2xl font-bold mb-3">:</span>
      <div className="flex flex-col items-center">
        <span className="text-3xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span>
        <span className="text-[10px] uppercase tracking-wider text-white/70">Hours</span>
      </div>
      <span className="text-2xl font-bold mb-3">:</span>
      <div className="flex flex-col items-center">
        <span className="text-3xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span>
        <span className="text-[10px] uppercase tracking-wider text-white/70">Minutes</span>
      </div>
      <span className="text-2xl font-bold mb-3">:</span>
      <div className="flex flex-col items-center">
        <span className="text-3xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span>
        <span className="text-[10px] uppercase tracking-wider text-white/70">Seconds</span>
      </div>
    </div>
  );
}
