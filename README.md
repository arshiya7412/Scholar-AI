# 🎓 Scholar AI

![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&style=flat-square)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?logo=tailwind-css&style=flat-square)
![Gemini API](https://img.shields.io/badge/Google_Gemini-AI-8E75B2?logo=google&style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**Scholar AI** is an intelligent, personalized academic mentor designed to help students plan their day, master difficult concepts, and stay focused. 

Powered by **Google's Gemini models**, it adapts to the student's specific learning pace ("Slow Bloomer", "Average", "Strong") to provide customized study plans and explanations.

---

## ✨ Key Features

### 📅 AI-Powered Study Planner
- Generates a realistic daily schedule based on your subjects, exam dates, and energy levels.
- **Dynamic Replanning:** Life happens! Tell the AI "I have a dentist appointment at 4 PM" or "I'm too tired for Math," and it instantly restructures your day.

### 🤖 Interactive AI Tutor
- **Context-Aware Chat:** Explains concepts based on your registered grade level and learning pace.
- **Visual Learning:** Capable of generating educational diagrams and illustrations on demand (e.g., "Draw a diagram of a plant cell").

### 🛡️ Focus Zone
- **Pomodoro Timer:** Built-in focus timer with break intervals.
- **App Blocker Simulator:** Visual interface to manage distractions by "blocking" social media apps during study sessions.

### 📊 Progress Tracking
- **Smart Analytics:** Visualizes study hours and focus consistency using interactive charts.
- **AI Insights:** Provides weekly qualitative feedback and encouragement based on your performance data.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS
- **AI Integration:** Google Gemini API (`@google/genai` SDK)
  - *Logic/Text:* `gemini-3-flash-preview`
  - *Image Generation:* `gemini-2.5-flash-image`
- **Icons:** Lucide React
- **Charts:** Recharts

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your machine.
- A Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/).

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/scholar-ai.git
   cd scholar-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your API key:
   ```env
   VITE_API_KEY=your_google_gemini_api_key_here
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

---


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
