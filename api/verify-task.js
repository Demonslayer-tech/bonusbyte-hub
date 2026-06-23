import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/verify-task', (req, res) => {
  // Log the entire body so we can see exactly what the frontend is sending
  console.log("DEBUG: Incoming request body:", JSON.stringify(req.body));

  // Destructure with fallbacks to catch varying field names
  const address = req.body.address || req.body.walletAddress || req.body.userAddress;
  const network = req.body.network || req.body.chainId;

  // Validation: Check if we have at least an address
  if (!address) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing address field in request body.',
      received: req.body 
    });
  }

  // If we reach here, we successfully captured the data
  return res.json({
    success: true,
    message: 'Task verification successful.',
    data: {
      registeredAddress: address,
      chainStatus: network === -239 ? 'Mainnet' : 'Testnet'
    }
  });
});

// Health check
app.get('/api/verify-task', (req, res) => {
  res.json({ status: 'Online', service: 'Verify Task Endpoint' });
});

export default app;