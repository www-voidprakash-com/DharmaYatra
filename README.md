# 🎲 DharmaYatra 101

A real-time, AI-powered educational game inspired by Hindu philosophy (Snakes & Ladders), built using **React + Firebase + Google Gemini**.

---

## ✨ Features
- 📜 **AI Sage Commentary:** Real-time narration and philosophical insights by a mystical AI Sage (Google Gemini).
- 🎙️ **Cosmic TTS:** Multimodal speech generation for the Sage's wisdom.
- 🎨 **SVG-Based Board:** High-fidelity, mathematically rendered board with dynamic snakes and golden ladders.
- 🌍 **Multilingual:** Support for English, Hindi, and Sanskrit.
- 🏆 **Live Leaderboard:** Real-time player synchronization via Firebase.
- 🛡️ **VoidPrakash Legal Footer:** Built-in disclaimers and copyright information.

---

## 🔧 Tech Stack
- **Frontend:** React + Vite + Tailwind CSS
- **AI Engine:** Google Gemini (via Cloud Functions & Direct Client Fallback)
- **Database/Backend:** Firebase Real-time Database & Cloud Functions
- **Audio:** Howler.js for atmospheric soundscapes

---

## 🚀 How to Run Locally

1. **Clone the repo**
   ```bash
   git clone https://github.com/www-voidprakash-com/DharmaYatra.git
   cd DharmaYatra
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env.local` file and add your Gemini API Key:
   ```bash
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Start Dev Server**
   ```bash
   npm run dev
   ```

---

## 📜 License
MIT (c) 2026 VoidPrakash. See [LICENSE](./LICENSE) for details.

---

## 👩‍💻 Conceived and Crafted by
**VoidPrakash** - Transforming ancient wisdom into digital journeys.
