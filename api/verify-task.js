import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/verify-task', (req, res) => {
  const { address, network } = req.body;
  
  if (!address) {
    return res.status(400).json({ success: false, message: 'Missing address' });
  }

  return res.json({
    success: true,
    message: 'Verified',
    data: { registeredAddress: address }
  });
});

export default app;