import { useState } from 'react';
import { useGameStore } from '../store/useGameStore';

interface Task {
  id: string;
  title: string;
  reward: number;
  link: string;
  status: 'start' | 'verifying' | 'claim' | 'completed';
}

export default function EarnPage() {
  const { syncWithCloud } = useGameStore();

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'tg_community',
      title: 'Join Official Telegram Community',
      reward: 5000,
      link: 'https://t.me/BonusByteAnnouncements',
      status: 'start'
    },
    {
      id: 'follow_x',
      title: 'Follow BonusByte on X (Twitter)',
      reward: 3500,
      link: 'https://x.com/BonusByte',
      status: 'start'
    },
    {
      id: 'youtube_sub',
      title: 'Subscribe to YouTube Channel',
      reward: 4000,
      link: 'https://youtube.com',
      status: 'start'
    }
  ]);

  const handleTaskAction = (task: Task) => {
    if (task.status === 'start') {
      window.open(task.link, '_blank');
      updateTaskStatus(task.id, 'verifying');

      // 10-second verification countdown simulation
      setTimeout(() => {
        updateTaskStatus(task.id, 'claim');
      }, 10000);

    } else if (task.status === 'claim') {
      const currentBalance = useGameStore.getState().balance;
      useGameStore.setState({ balance: currentBalance + task.reward });
      
      updateTaskStatus(task.id, 'completed');
      syncWithCloud();
      
      alert(`🎉 Success! +${task.reward.toLocaleString()} $BB added to your balance.`);
    }
  };

  const updateTaskStatus = (id: string, nextStatus: Task['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: nextStatus } : t))
    );
  };

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px', height: '100%', boxSizing: 'border-box', overflowY: 'auto' }}>
      <div>
        <h2 style={{ margin: 0, fontSize: '18px', color: '#FFF' }}>Missions Dashboard</h2>
        <p style={{ margin: '5px 0 0 0', fontSize: '12px', opacity: 0.5 }}>Complete cloud assignments to multiply your allocation metrics.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
        {tasks.map((task) => {
          const isVerifying = task.status === 'verifying';
          const isClaim = task.status === 'claim';
          const isCompleted = task.status === 'completed';

          let btnText = 'START';
          let btnBg = '#00E5FF';
          let btnColor = 'black';
          let isButtonDisabled = false;

          if (isVerifying) {
            btnText = '⏳ CHECKING';
            btnBg = 'rgba(255,255,255,0.05)';
            btnColor = 'rgba(255,255,255,0.3)';
            isButtonDisabled = true;
          } else if (isClaim) {
            btnText = '🎁 CLAIM';
            btnBg = '#00FF66';
            btnColor = 'black';
          } else if (isCompleted) {
            btnText = '✓ DONE';
            btnBg = 'rgba(0, 229, 255, 0.05)';
            btnColor = '#00E5FF';
            isButtonDisabled = true;
          }

          return (
            <div 
              key={task.id} 
              style={{ background: '#161820', padding: '16px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid rgba(255,255,255,0.03)', opacity: isCompleted ? 0.6 : 1, transition: 'opacity 0.2s' }}
            >
              <div>
                <h4 style={{ margin: 0, fontSize: '13px', color: '#FFF' }}>{task.title}</h4>
                <span style={{ fontSize: '12px', color: isClaim ? '#00FF66' : '#00E5FF', fontWeight: 'bold', display: 'inline-block', marginTop: '4px' }}>
                  +{task.reward.toLocaleString()} $BB
                </span>
              </div>
              <button 
                onClick={() => handleTaskAction(task)}
                disabled={isButtonDisabled}
                style={{ background: btnBg, color: btnColor, border: 'none', fontWeight: 'bold', padding: '10px 16px', borderRadius: '10px', fontSize: '11px', cursor: isButtonDisabled ? 'default' : 'pointer', letterSpacing: '0.5px', transition: 'all 0.2s' }}
              >
                {btnText}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}