import admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    // Clean up the key: Vercel env vars often escape newlines
    const rawKey = process.env.FIREBASE_PRIVATE_KEY;
    const privateKey = rawKey ? rawKey.replace(/\\n/g, '\n') : "";

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
      databaseURL: "https://bonusbyte-hub-default-rtdb.firebaseio.com"
    });
  } catch (error) {
    console.error("Firebase Initialization Failed:", error);
  }
}

export default async function handler(req, res) {
  // Always return JSON, even on error, so the frontend doesn't crash
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
  
  try {
    const { walletAddress, taskId } = req.body;
    if (!walletAddress || !taskId) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    const db = admin.database();
    const cleanAddress = walletAddress.replace(/[.#$[\]]/g, "_");
    const userRef = db.ref('users/' + cleanAddress);

    const snapshot = await userRef.once('value');
    const userData = snapshot.val() || { points: 0, tasks: {} };

    if (userData.tasks && userData.tasks[taskId]) {
      return res.status(400).json({ success: false, message: "Task already completed" });
    }

    await userRef.update({
      points: (userData.points || 0) + 50,
      tasks: { ...(userData.tasks || {}), [taskId]: true }
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("API Logic Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}