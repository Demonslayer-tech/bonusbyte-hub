import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://bonusbyte-hub-default-rtdb.firebaseio.com" // Update with your actual database URL
    });
  } catch (error) {
    console.error("Firebase initialization error:", error);
  }
}

app.post('/api/verify-task', async (req, res) => {
  const { walletAddress, taskId } = req.body;
  
  if (!walletAddress || !taskId) {
    return res.status(400).json({ success: false, message: 'Invalid data' });
  }

  const cleanAddress = walletAddress.replace(/[.#$[\]]/g, "_");
  const db = admin.database();
  const userRef = db.ref('users/' + cleanAddress);

  try {
    // Get current data
    const snapshot = await userRef.once('value');
    let userData = snapshot.val() || { points: 0, tasks: {} };

    // Check if task is already completed
    if (userData.tasks && userData.tasks[taskId]) {
      return res.status(400).json({ success: false, message: 'Task already completed' });
    }

    // Update data
    userData.points = (userData.points || 0) + 50;
    userData.tasks = { ...(userData.tasks || {}), [taskId]: true };

    // Save to Firebase
    await userRef.set(userData);

    return res.json({ success: true, points: userData.points });
  } catch (error) {
    console.error("Database update error:", error);
    return res.status(500).json({ success: false, message: 'Server error updating database' });
  }
});

export default app;