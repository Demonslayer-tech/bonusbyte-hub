import { HashRouter, Routes, Route } from 'react-router-dom';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import TapPage from './pages/TapPage';
import EarnPage from './pages/EarnPage';
import UserPage from './pages/UserPage';
import './App.css';

export default function App() {
  return (
    <TonConnectUIProvider manifestUrl="https://bonusbyte-hub.vercel.app/tonconnect-manifest.json">
      <HashRouter>
        <Routes>
          <Route path="/" element={<TapPage />} />
          <Route path="/earn" element={<EarnPage />} />
          <Route path="/user" element={<UserPage />} />
        </Routes>
      </HashRouter>
    </TonConnectUIProvider>
  );
}