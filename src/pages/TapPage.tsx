import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';

interface FloatingText {
  id: number;
  x: number;
  y: number;
}

export default function TapPage() {
  const { 
    balance, handleTap, tapMultiplier, energy,
    multiversionLevel, energyLevel, buyMultiplierUpgrade, buyEnergyUpgrade, claimDailyReward 
  } = useGameStore();
  
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [isPressed, setIsPressed] = useState(false);
  const [showShop, setShowShop] = useState(false);

  const multCost = multiversionLevel * 500;
  const energyCost = energyLevel * 400;

  const onTapClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (energy < tapMultiplier) return;
    
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);
    
    handleTap();

    const target = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - target.left;
    const y = e.clientY - target.top;

    const newText = { id: Date.now() + Math.random(), x, y };
    setFloatingTexts((prev) => [...prev, newText]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((txt) => txt.id !== newText.id));
    }, 800);
  };

  const handleClaim = () => {
    const success = claimDailyReward();
    if (success) {
      alert("🎉 5,000 $BB claimed successfully!");
    } else {
      alert("⏳ Daily reward cooling down! Check back later.");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%', padding: '10px 20px' }}>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
        <button onClick={handleClaim} style={{ background: '#1C1F2B', color: '#00E5FF', border: '1px solid rgba(0,229,255,0.2)', padding: '8px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
          📅 Daily Streak
        </button>
        <button onClick={() => setShowShop(!showShop)} style={{ background: '#1C1F2B', color: '#FFF', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 12px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
          {showShop ? 'Back ↩' : '🛒 Upgrades'}
        </button>
      </div>

      {!showShop ? (
        <>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p style={{ fontSize: '11px', opacity: 0.4, letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>Pre-Launch Balance</p>
            <h1 style={{ fontSize: '48px', fontWeight: '900', margin: '5px 0', color: '#00E5FF' }}>{balance.toLocaleString()}</h1>
          </div>

          <div style={{ position: 'relative', margin: '30px 0' }}>
            {floatingTexts.map((txt) => (
              <span key={txt.id} style={{ position: 'absolute', left: txt.x, top: txt.y, color: '#00E5FF', fontWeight: 'bold', fontSize: '36px', pointerEvents: 'none', animation: 'floatUp 0.8s ease-out forwards', zIndex: 10 }}>
                +{tapMultiplier}
              </span>
            ))}
            <button 
              onClick={onTapClick} 
              style={{ 
                width: '240px', height: '240px', borderRadius: '50%', 
                background: 'linear-gradient(#1A1D26, #0A0B0F)', 
                border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none', 
                boxShadow: isPressed ? '0 0 20px rgba(0,229,255,0.4)' : '0 0 40px rgba(0,0,0,0.6)',
                transform: isPressed ? 'scale(0.95)' : 'scale(1)',
                transition: 'transform 0.05s ease, box-shadow 0.05s ease'
              }}
            >
              <span style={{ fontSize: '95px', filter: 'drop-shadow(0 0 15px #00E5FF)' }}>🪙</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '6px 14px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)', fontSize: '11px', opacity: 0.7 }}>
              ⚡ MULTIPLIER: x{tapMultiplier}
            </div>
          </div>
        </>
      ) : (
        <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>
          <div>
            <h3 style={{ margin: 0, color: '#00E5FF' }}>Core Upgrade Shop</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.5 }}>Burn tokens to upgrade hardware modules.</p>
          </div>

          <div style={{ background: '#161820', padding: '14px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '13px' }}>Multi-Tap (Lvl {multiversionLevel})</h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', opacity: 0.4 }}>Increases click value by +1</p>
              <span style={{ fontSize: '12px', color: '#00E5FF', fontWeight: 'bold' }}>🪙 {multCost.toLocaleString()} $BB</span>
            </div>
            <button 
              onClick={buyMultiplierUpgrade}
              disabled={balance < multCost}
              style={{ background: balance >= multCost ? '#00E5FF' : 'rgba(255,255,255,0.05)', color: balance >= multCost ? 'black' : 'rgba(255,255,255,0.2)', border: 'none', fontWeight: 'bold', padding: '10px 16px', borderRadius: '10px', fontSize: '11px', cursor: balance >= multCost ? 'pointer' : 'default' }}
            >
              UPGRADE
            </button>
          </div>

          <div style={{ background: '#161820', padding: '14px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '13px' }}>Energy Capacitors (Lvl {energyLevel})</h4>
              <p style={{ margin: '2px 0 0 0', fontSize: '11px', opacity: 0.4 }}>Adds +500 Max Capacity</p>
              <span style={{ fontSize: '12px', color: '#00E5FF', fontWeight: 'bold' }}>🪙 {energyCost.toLocaleString()} $BB</span>
            </div>
            <button 
              onClick={buyEnergyUpgrade}
              disabled={balance < energyCost}
              style={{ background: balance >= energyCost ? '#00E5FF' : 'rgba(255,255,255,0.05)', color: balance >= energyCost ? 'black' : 'rgba(255,255,255,0.2)', border: 'none', fontWeight: 'bold', padding: '10px 16px', borderRadius: '10px', fontSize: '11px', cursor: balance >= energyCost ? 'pointer' : 'default' }}
            >
              UPGRADE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}