import { useGameStore } from '../store/useGameStore';

export default function UserPage() {
  const { userId, username, referralCode, referralCount, referralList, balance } = useGameStore();

  const copyToClipboard = () => {
    const inviteLink = `https://t.me/BonusByteBot/app?startapp=${referralCode}`;
    navigator.clipboard.writeText(inviteLink);
    alert("🚀 Invite link copied to clipboard! Send it to your squad.");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px', boxSizing: 'border-box', overflowY: 'auto' }}>
      
      {/* Profile Header Card */}
      <div style={{ background: 'linear-gradient(135deg, #1C1F2B 0%, #0D0E15 100%)', border: '1px solid rgba(0,229,255,0.1)', padding: '20px', borderRadius: '20px', textAlign: 'center', marginBottom: '25px' }}>
        <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#00E5FF', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 'bold', margin: '0 auto 12px auto', boxShadow: '0 0 20px rgba(0,229,255,0.3)' }}>
          {username.charAt(0).toUpperCase()}
        </div>
        <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: 'bold', color: '#FFF' }}>{username}</h2>
        <p style={{ margin: '0 0 15px 0', fontSize: '11px', color: '#00E5FF', opacity: 0.8, fontFamily: 'monospace' }}>ID: {userId}</p>
        
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px', display: 'flex', justifyContent: 'space-around' }}>
          <div>
            <span style={{ display: 'block', fontSize: '11px', opacity: 0.4, textTransform: 'uppercase' }}>Assets</span>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#00E5FF' }}>🪙 {balance.toLocaleString()}</span>
          </div>
          <div style={{ borderLeft: '1px solid rgba(255,255,255,0.05)' }}></div>
          <div>
            <span style={{ display: 'block', fontSize: '11px', opacity: 0.4, textTransform: 'uppercase' }}>Squad Size</span>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFF' }}>👥 {referralCount}</span>
          </div>
        </div>
      </div>

      {/* Referral Link Engine */}
      <div style={{ background: '#161820', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.03)', marginBottom: '25px' }}>
        <h3 style={{ margin: '0 0 6px 0', fontSize: '14px', color: '#FFF' }}>Invite Friends & Earn</h3>
        <p style={{ margin: '0 0 14px 0', fontSize: '12px', opacity: 0.5, lineHeight: '1.4' }}>
          Get <span style={{ color: '#00E5FF', fontWeight: 'bold' }}>+5,000 $BB</span> tokens instantly for every friend that activates your server network link.
        </p>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1, background: '#0D0E15', padding: '12px', borderRadius: '10px', fontSize: '12px', color: '#00E5FF', border: '1px solid rgba(255,255,255,0.05)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'flex', alignItems: 'center' }}>
            BYTE_{referralCode}
          </div>
          <button 
            onClick={copyToClipboard}
            style={{ background: '#00E5FF', color: '#000', border: 'none', fontWeight: 'bold', padding: '0 18px', borderRadius: '10px', fontSize: '12px', cursor: 'pointer', transition: 'background 0.2s' }}
          >
            🔗 COPY
          </button>
        </div>
      </div>

      {/* Referral Active List Registry */}
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#FFF', display: 'flex', justifyContent: 'space-between' }}>
          <span>Active Nodes</span>
          <span style={{ fontSize: '12px', color: '#00E5FF', opacity: 0.6 }}>{referralList.length} total</span>
        </h3>
        
        {referralList.length === 0 ? (
          <div style={{ padding: '30px 0', textAlign: 'center', opacity: 0.3, fontSize: '13px' }}>
            No active referral nodes deployed yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {referralList.map((ref: any) => (
              <div 
                key={ref.id} 
                style={{ background: '#11131A', padding: '12px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.02)' }}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#FFF' }}>@{ref.username}</div>
                  <div style={{ fontSize: '10px', opacity: 0.3, marginTop: '2px' }}>Activated: {ref.date}</div>
                </div>
                <div style={{ fontSize: '12px', color: '#00E5FF', fontWeight: 'bold' }}>
                  +{ref.bonusEarned.toLocaleString()} $BB
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}