import { useEffect, useState } from 'react';

interface MiningCircleProps {
  miningBalance: number;
  isActive: boolean;
  lastMiningStart?: number;
}

export const MiningCircle = ({ miningBalance, isActive, lastMiningStart }: MiningCircleProps) => {
  const [currentEarnings, setCurrentEarnings] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isActive || !lastMiningStart) {
      setCurrentEarnings(0);
      setProgress(0);
      return;
    }

    const dailyProfit = miningBalance * 0.01; // 1% daily
    const profitPerSecond = dailyProfit / (24 * 60 * 60);
    
    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - lastMiningStart) / 1000; // seconds
      const dayProgress = (elapsed % (24 * 60 * 60)) / (24 * 60 * 60);
      
      setProgress(dayProgress * 100);
      setCurrentEarnings(elapsed * profitPerSecond);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, miningBalance, lastMiningStart]);

  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-64 h-64 mx-auto">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-full mining-glow opacity-50"></div>
      
      {/* SVG Circle */}
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
        {/* Background circle */}
        <circle
          cx="100"
          cy="100"
          r="90"
          stroke="hsl(var(--border))"
          strokeWidth="8"
          fill="none"
          opacity="0.2"
        />
        
        {/* Progress circle */}
        <circle
          cx="100"
          cy="100"
          r="90"
          stroke="hsl(var(--primary))"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear"
          style={{
            filter: 'drop-shadow(0 0 10px hsl(var(--primary)))',
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="text-sm text-muted-foreground mb-2">Mining Active</div>
          <div className="text-3xl font-bold neon-text">
            {currentEarnings.toFixed(8)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">TON</div>
          <div className="text-xs text-primary mt-3">
            {progress.toFixed(2)}% Complete
          </div>
        </div>
      </div>
      
      {/* Rotating outer ring animation */}
      {isActive && (
        <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-spin-glow"></div>
      )}
    </div>
  );
};
