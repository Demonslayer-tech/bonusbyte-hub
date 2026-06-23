import { useState, useRef } from 'react';
import WebApp from '@twa-dev/sdk';

export default function TapPage() {
  const [points, setPoints] = useState<number>(0);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const syncToCloud = async (finalPoints: number) => {
    try {
      const userId = WebApp.initDataUnsafe?.user?.id || 'guest';
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, points: finalPoints })
      });
    } catch (e) {
      console.error("Sync error:", e);
    }
  };

  const handleTap = () => {
    setPoints((prev) => prev + 1);
    WebApp.HapticFeedback.impactOccurred('light');
    
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => syncToCloud(points + 1), 1000);
  };

  return (
    <div className="page">
      <div className="score-display">Energy: {points}</div>
      <button className="tap-coin" onClick={handleTap}>TAP</button>
    </div>
  );
}