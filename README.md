# 🧠 AI Assistant Hub

A free full-stack AI Assistant web app built with React, Firebase, and Gemini API. Get AI-powered recommendations for music, movies, books, and sports matches, plus study assistance features.

## ✨ Features

### 🎯 AI Assistants
- 🎧 **Spotify AI** - Get personalized music recommendations
- 🎬 **Movie AI** - Discover your next favorite watch
- 📚 **Book AI** - Find books tailored to your taste
- ⚽ **Sports AI** - Discover upcoming matches and tournaments

### 💾 List Management
- 📋 **Save to Lists** - Create personalized lists of songs, movies, books, and sports matches
- 📅 **Calendar Scheduling** - Schedule when to watch, read, listen, or watch matches
- 🔔 **Notifications** - Get notified about scheduled items
- 🔘 **Auto-Suggestions** - Quick suggestion buttons for instant recommendations

### 📝 Study Features
- 🔐 Google Sign-In authentication
- 📝 Create and manage notes
- ✨ AI-powered note summarization
- 🧩 Generate quizzes from notes
- ❓ Ask questions and get AI answers

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS
- **Backend:** Firebase (Auth, Firestore, Hosting)
- **AI:** Google Gemini API

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Firebase account
- Gemini API key (free tier available)

### Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-assistant-hub.git
   cd ai-assistant-hub
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

## 📦 Build

```bash
npm run build
```

## 🚀 Deploy

This project is configured for Vercel deployment. See `GITHUB_VERCEL_SETUP.md` for detailed deployment instructions.

## 📝 License

This project is open source and available for personal and commercial use.

---

Built with ❤️ using React, Firebase, and Gemini AI
