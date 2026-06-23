import { useEffect, useState } from 'react';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { ref, get } from "firebase/database";
import { database } from "./firebase";
import './App.css';

interface UserData {
  points: number;
  tasks: Record<string, boolean>;
}

const TASKS = [
  { id: 'telegram', title: 'Join Telegram Community', link: 'https://t.me/bonusbyte_announcement' },
  { id: 'twitter', title: 'Follow X/Twitter Page', link: 'https://x.com/bonusbyte?s=11' },
  { id: 'youtube', title: 'Follow YouTube Page', link: 'https://www.youtube.com/@Bonusbyte_app' },
  { id: 'checkin', title: 'Daily Check-in', link: '#' },
];

function App() {
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const [userData, setUserData] = useState<UserData>({ points: 0, tasks: {} });

  const fetchUserData = async () => {
    if (!wallet) return;
    const cleanAddress = wallet.account.address.replace(/[.#$[\]]/g, "_");
    const userRef = ref(database, 'users/' + cleanAddress);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      setUserData(snapshot.val());
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [wallet]);

  const completeTask = async (taskId: string) => {
    if (!wallet) return alert("Connect wallet first!");
    
    const response = await fetch('/api/verify-task', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        walletAddress: wallet.account.address, 
        taskId 
      })
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      alert("Task verified! +50 points.");
      
      // Update state immediately so UI reflects +50 points
      setUserData(prev => ({
        ...prev,
        points: prev.points + 50,
        tasks: { ...prev.tasks, [taskId]: true }
      }));
    } else {
      alert("Error: " + (data.message || "Failed"));
    }
  };

  return (
    <div className="app-container">
      <header>
        <h1>BonusByte Hub</h1>
        <button onClick={() => tonConnectUI.openModal()}>
          {wallet ? 'Connected' : 'Connect Wallet'}
        </button>
      </header>

      {wallet && (
        <div className="dashboard">
          <div className="stats">
            <h2>Points: {userData.points}</h2>
          </div>
          <div className="task-list">
            {TASKS.map((task) => (
              <div key={task.id} className="task-card">
                <span>{task.title}</span>
                <button 
                  disabled={!!userData.tasks[task.id]}
                  onClick={() => {
                    if (task.link !== '#') window.open(task.link, '_blank');
                    completeTask(task.id);
                  }}
                >
                  {userData.tasks[task.id] ? 'Completed' : 'Claim 50 pts'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;