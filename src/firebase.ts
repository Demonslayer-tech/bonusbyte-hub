import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCzzbl75e8p3NMRKDjIh4CNkG1HY9O6if0",
  authDomain: "bonusbyte-hub.firebaseapp.com",
  projectId: "bonusbyte-hub",
  storageBucket: "bonusbyte-hub.firebasestorage.app",
  messagingSenderId: "1026736760975",
  appId: "1:1026736760975:web:3d4e172b2b2eb55b8b68fa",
  measurementId: "G-NPNKEEPX4D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the database instance so other files can use it
export const database = getDatabase(app);