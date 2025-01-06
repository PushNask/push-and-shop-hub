import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductTimerProps {
  expiry?: string;
}

export function ProductTimer({ expiry }: ProductTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [timeStatus, setTimeStatus] = useState<'ample' | 'medium' | 'critical'>('ample');

  useEffect(() => {
    if (!expiry) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiryTime = new Date(expiry).getTime();
      const distance = expiryTime - now;
      const totalDuration = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      
      if (distance < 0) {
        setTimeLeft("EXPIRED");
        setTimeStatus('critical');
        return null;
      }

      // Calculate time status based on remaining time
      if (distance > totalDuration * 0.7) {
        setTimeStatus('ample');
      } else if (distance > totalDuration * 0.3) {
        setTimeStatus('medium');
      } else {
        setTimeStatus('critical');
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    setTimeLeft(calculateTimeLeft() || "EXPIRED");

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      if (remaining === null) {
        clearInterval(timer);
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [expiry]);

  if (!timeLeft) return null;

  return (
    <div className={cn(
      "absolute top-0 left-0 right-0 z-10 px-4 py-2 text-sm font-medium text-white",
      "flex items-center justify-center gap-2 backdrop-blur-sm",
      timeStatus === 'ample' && "bg-green-500/80",
      timeStatus === 'medium' && "bg-yellow-500/80",
      timeStatus === 'critical' && "bg-red-500/80"
    )}>
      <Clock className="h-4 w-4" />
      <span>{timeLeft}</span>
    </div>
  );
}