
// firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyAVfk_qp5QRBcT8qGk68R8izkWa-gTWfEE",
  authDomain: "bharatiya-snakes-n-ladders.firebaseapp.com",
  databaseURL: "https://bharatiya-snakes-n-ladders-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bharatiya-snakes-n-ladders",
  storageBucket: "bharatiya-snakes-n-ladders.firebasestorage.app",
  messagingSenderId: "396028528932",
  appId: "1:396028528932:web:23703e18d8038ff4900bb1",
  measurementId: "G-E6RX653ZB5"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const functions = getFunctions(app, 'asia-southeast1'); // Matching your DB region

export { db, functions };
