const express = require('express');
const cors = require('cors');
const Datastore = require('nedb-async');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Initialize lightweight database files
const db = new Datastore({ filename: './database.db', autoplay: true });

// Middleware to fetch or create a profile on demand
async function getOrCreateProfile(userId) {
  let profile = await db.findOne({ userId });
  if (!profile) {
    profile = {
      userId,
      balance: 1000,
      energy: 1000,
      maxEnergy: 1000,
      tapMultiplier: 1,
      connectedWallet: null,
      lastSaved: Date.now()
    };
    await db.insert(profile);
  }
  return profile;
}

// 1. Fetch User Data Profile
app.get('/api/user/:id', async (req, res) => {
  try {
    const profile = await getOrCreateProfile(req.params.id);
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Synchronize Tapping Sync Events
app.post('/api/user/:id/sync', async (req, res) => {
  try {
    const { balance, energy } = req.body;
    await db.update(
      { userId: req.params.id },
      { $set: { balance, energy, lastSaved: Date.now() } }
    );
    res.json({ status: 'success' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Bind Wallet Data Hook
app.post('/api/user/:id/wallet', async (req, res) => {
  try {
    const { walletAddress } = req.body;
    await db.update(
      { userId: req.params.id },
      { $set: { connectedWallet: walletAddress } }
    );
    res.json({ status: 'wallet_linked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 BONUSBYTE Secure Engine listening on http://localhost:${PORT}`);
});