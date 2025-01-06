import { useState, useEffect } from "react";

export const useTimeLeft = (expiry?: string) => {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    if (!expiry) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiryTime = new Date(expiry).getTime();
      const distance = expiryTime - now;
      
      if (distance < 0) {
        return "EXPIRED";
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    const updateTimer = () => {
      const remaining = calculateTimeLeft();
      setTimeLeft(remaining);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [expiry]);

  return timeLeft;
};