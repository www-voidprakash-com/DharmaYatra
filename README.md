# 🎲 Bharatiya Snakes & Ladders

A real-time multiplayer game built using React + Firebase. Designed with a playful Indian theme, this project demonstrates Web App development, state sync, user inputs, and hosting.

---

## 🔧 Tech Stack
- React + Vite (Frontend)
- Firebase Realtime Database (Sync)
- Firebase Hosting (Deploy)

---

## 🚀 How to Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/bharatiya-snakes-ladders.git
cd bharatiya-snakes-ladders
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Firebase
Create a `firebase.js` file:
```js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = { /* Paste your config here */ };
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export { db };
```

### 4. Start dev server
```bash
npm run dev
```

---

## 🌍 Deploying to Firebase Hosting
```bash
npm run build
firebase deploy
```

---

## ✅ Features Implemented
- 🎯 Nickname Login
- 🧠 Real-time Player Sync
- 🎲 Dice with Animation
- 🏆 Live Leaderboard
- 🔥 Firebase Integration
- 🌐 Web Hosting

---

## 👩‍💻 Contributions
Made by Ashmika Agarwal using Google AI Studio + Custom React Code with real-time collaboration and VoidPrakash.

---

## 📜 License
MIT (feel free to fork and use!)

---

## 📸 Screenshots
*(add screenshots of board, dice roll, leaderboard, nickname UI)*
