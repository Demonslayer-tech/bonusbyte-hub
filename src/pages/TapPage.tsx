import { useState } from 'react';
export default function TapPage() {
  const [points, setPoints] = useState(0);
  const handleTap = () => setPoints(p => p + 1);
  return (
    <div className="page">
      <h1>Tap Game</h1>
      <div className="tap-coin" onClick={handleTap}>
        <h2>{points}</h2>
      </div>
    </div>
  );
}