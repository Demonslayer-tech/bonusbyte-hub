import express from 'express';
import cors from 'cors';
import * as admin from 'firebase-admin';
import { getDatabase } from 'firebase-admin/database';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin using namespace import
if (!admin.apps || admin.apps.length === 0) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://bonusbyte-hub-default-rtdb.firebaseio.com"
    });
  } catch (error) {
    console.error("Firebase initialization error:", error);
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

    // Check if task is already completed
    if (userData.tasks && userData.tasks[taskId]) {
      return res.status(400).json({ success: false, message: 'Task already completed' });
    }

    // Update data
    userData.points = (userData.points || 0) + 50;
    userData.tasks = { ...(userData.tasks || {}), [taskId]: true };

    await userRef.set(userData);

    return res.json({ success: true, points: userData.points });
  } catch (error) {
    console.error("Database update error:", error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default app;