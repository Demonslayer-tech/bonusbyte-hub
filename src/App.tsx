import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import TapPage from './pages/TapPage';
import EarnPage from './pages/EarnPage';
import AirdropPage from './pages/AirdropPage';
import UserPage from './pages/UserPage';
import './App.css';

function App() {
  return (
    <TonConnectUIProvider manifestUrl="https://bonusbyte-hub.vercel.app/tonconnect-manifest.json">
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<TapPage />} />
            <Route path="/earn" element={<EarnPage />} />
            <Route path="/airdrop" element={<AirdropPage />} />
            <Route path="/user" element={<UserPage />} />
          </Routes>
          <nav className="bottom-nav">
            <Link to="/">🎮 Tap</Link>
            <Link to="/earn">✅ Earn</Link>
            <Link to="/airdrop">🪂 Airdrop</Link>
            <Link to="/user">👤 Profile</Link>
          </nav>
        </div>
      </Router>
    </TonConnectUIProvider>
  );
}
export default App;