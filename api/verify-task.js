import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import { getDatabase } from 'firebase-admin/database';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin using default import
if (!admin.apps || admin.apps.length === 0) {
  const jsonString = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  
  if (jsonString) {
    try {
      const serviceAccount = JSON.parse(jsonString);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://bonusbyte-hub-default-rtdb.firebaseio.com"
      });
    } catch (error) {
      console.error("Initialization Error:", error.message);
    }
  }
}

app.post('/api/verify-task', async (req, res) => {
  try {
    const { walletAddress, taskId } = req.body;
    
    if (!walletAddress || !taskId) {
      return res.status(400).json({ success: false, message: 'Invalid data' });
    }

    const cleanAddress = walletAddress.replace(/[.#$[\]]/g, "_");
    const db = getDatabase();
    const userRef = db.ref('users/' + cleanAddress);

    const snapshot = await userRef.once('value');
    let userData = snapshot.val() || { points: 0, tasks: {} };

    if (userData.tasks && userData.tasks[taskId]) {
      return res.status(400).json({ success: false, message: 'Task already completed' });
    }

    userData.points = (userData.points || 0) + 50;
    userData.tasks = { ...(userData.tasks || {}), [taskId]: true };

    await userRef.set(userData);
    return res.json({ success: true, points: userData.points });
  } catch (error) {
    console.error("Database Update Error:", error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default app;