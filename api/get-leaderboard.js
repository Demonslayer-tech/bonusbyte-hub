import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

// Initialize Firebase only once
if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)),
    databaseURL: "https://bonusbyte-hub-default-rtdb.firebaseio.com"
  });
}

export default async function handler(req, res) {
  // Ensure only GET requests are allowed for the leaderboard
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const db = getDatabase();
    const snapshot = await db.ref('users')
      .orderByChild('points')
      .limitToLast(10)
      .once('value');
    
    const leaderboard = [];
    snapshot.forEach((child) => {
      leaderboard.push({
        address: child.key,
        points: child.val().points
      });
    });

    // Reverse to show the highest points at the top
    return res.status(200).json(leaderboard.reverse());
  } catch (error) {
    console.error("Leaderboard Fetch Error:", error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}