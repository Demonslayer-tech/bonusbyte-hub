import express from 'express';
import cors from 'cors';
import { initializeApp } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import admin from 'firebase-admin';

// You will need to add your serviceAccountKey.json to your Vercel project
// Or use environment variables for Firebase credentials
const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/verify-task', async (req, res) => {
  const { walletAddress, taskId } = req.body;
  
  if (!walletAddress || !taskId) {
    return res.status(400).json({ success: false, message: 'Invalid data' });
  }

  const cleanAddress = walletAddress.replace(/[.#$[\]]/g, "_");
  const db = admin.database();
  const userRef = db.ref('users/' + cleanAddress);

  // 1. Get current user data from Firebase
  const snapshot = await userRef.once('value');
  let userData = snapshot.val() || { points: 0, tasks: {} };

  // 2. Check if task is already done
  if (userData.tasks && userData.tasks[taskId]) {
    return res.status(400).json({ success: false, message: 'Task already completed' });
  }

  // 3. Update data
  userData.points = (userData.points || 0) + 50;
  userData.tasks = { ...userData.tasks, [taskId]: true };

  // 4. Save back to Firebase
  await userRef.set(userData);

  return res.json({ success: true, points: userData.points });
});

export default app;