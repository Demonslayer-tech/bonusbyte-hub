import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Note: './App' matches the export default above
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const MANIFEST_URL = `${window.location.origin}/tonconnect-manifest.json`;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <TonConnectUIProvider manifestUrl={MANIFEST_URL}>
      <App />
    </TonConnectUIProvider>
  </React.StrictMode>,
);