const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors());
app.use(express.json());

// API route to listen for wallet synchronization handshakes
app.post('/api/sync-wallet', (req, res) => {
  const { address, network, timestamp } = req.body;

  if (!address) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing standard account validation parameters.' 
    });
  }

  // Console log outputs directly to your server metrics stream
  console.log(`[Wallet Sync] Syncing address: ${address} on network chain ID: ${network}`);

  /* DATABASE LOGIC AREA:
      Save/Update user records into your database setup here
  */

  return res.json({
    success: true,
    message: 'Wallet account coordinates matched and cataloged successfully.',
    data: {
      registeredAddress: address,
      chainStatus: network === -239 ? 'Mainnet' : 'Testnet'
    }
  });
});

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Online', service: 'BonusByte API Hub Core' });
});

// Export the app for Vercel (Do not use app.listen)
module.exports = app;