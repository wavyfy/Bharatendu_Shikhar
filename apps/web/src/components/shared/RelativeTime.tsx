"use client";

import { useEffect, useState } from "react";

function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return "Just now";
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
}

export function RelativeTime({ dateString, className }: { dateString: string; className?: string }) {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    // Initial update deferred to avoid synchronous setState warning
    const initTimer = setTimeout(() => {
      setTimeStr(getRelativeTime(dateString));
    }, 0);
    
    // Update every minute
    const interval = setInterval(() => {
      setTimeStr(getRelativeTime(dateString));
    }, 60000);
    
    return () => {
      clearTimeout(initTimer);
      clearInterval(interval);
    };
  }, [dateString]);

  // Prevent hydration mismatch by returning null until client-side calculation is done
  if (!timeStr) return null;

  return (
    <span className={className}>
      {timeStr}
    </span>
  );
}
