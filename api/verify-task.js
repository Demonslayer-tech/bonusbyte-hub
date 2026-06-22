const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// This route now matches the URL your frontend is calling
app.post('/api/verify-task', (req, res) => {
  const { address, network } = req.body;

  if (!address) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing standard account validation parameters.' 
    });
  }

  console.log(`[Verify Task] Processing address: ${address}`);

  return res.json({
    success: true,
    message: 'Task verification successful.',
    data: {
      registeredAddress: address,
      chainStatus: network === -239 ? 'Mainnet' : 'Testnet'
    }
  });
});

// Basic health check for this specific endpoint
app.get('/api/verify-task', (req, res) => {
  res.json({ status: 'Online', service: 'Verify Task Endpoint' });
});

module.exports = app;