import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import { getDatabase } from 'firebase-admin/database'; // Import this

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://bonusbyte-hub-default-rtdb.firebaseio.com"
    });
  } catch (error) {
    console.error("Firebase init error:", error);
  }
}

app.post('/api/verify-task', async (req, res) => {
  try {
    const { walletAddress, taskId } = req.body;
    
    if (!walletAddress || !taskId) {
      return res.status(400).json({ success: false, message: 'Invalid data' });
    }

    const cleanAddress = walletAddress.replace(/[.#$[\]]/g, "_");
    
    // FIX: Use getDatabase() instead of admin.database()
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
    console.error("Database update error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

export default app;