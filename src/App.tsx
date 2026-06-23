import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import './App.css';

// Lazy loading for production performance
const TapPage = lazy(() => import('./pages/TapPage'));
const EarnPage = lazy(() => import('./pages/EarnPage'));
const UserPage = lazy(() => import('./pages/UserPage'));

export default function App() {
  return (
    <TonConnectUIProvider manifestUrl="https://bonusbyte-hub.vercel.app/tonconnect-manifest.json">
      <HashRouter>
        <Suspense fallback={<div className="loading">Loading Universe...</div>}>
          <Routes>
            <Route path="/" element={<TapPage />} />
            <Route path="/earn" element={<EarnPage />} />
            <Route path="/user" element={<UserPage />} />
          </Routes>
          <nav className="bottom-nav">
             {/* Add Link components here */}
          </nav>
        </Suspense>
      </HashRouter>
    </TonConnectUIProvider>
  );
}