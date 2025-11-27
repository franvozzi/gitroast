# 🔥 GitRoast

> The AI that judges your code without mercy.

![Project Status](https://img.shields.io/badge/Status-MVP_Complete-success)
![AI Model](https://img.shields.io/badge/AI-Gemini_2.0_Flash_Lite-blue)
![Stack](https://img.shields.io/badge/Stack-Next.js_14_+_Tailwind-black)

A web application that uses **Google Gemini 2.0 Flash Lite** to analyze GitHub repositories in real-time, critique code quality, detect "Red Flags", and generate reports with acid (and sometimes cruel) humor.

## 🚀 Tech Stack

- **Frontend:** Next.js 14 (App Router) + React
- **Styling:** Tailwind CSS (Cyberpunk UI)
- **Intelligence:** Google Gemini API (`gemini-2.0-flash-lite-001`)
- **Data Source:** GitHub REST API

## 🛠️ Local Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/git-roast.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables: Create a `.env.local` file and add:
   ```env
   GEMINI_API_KEY=your_google_ai_api_key
   GITHUB_TOKEN=your_optional_token_for_rate_limit
   ```

4. Run the server:
   ```bash
   npm run dev
   ```

## 🤖 Features

- **Dual Mode:** Choose between "Spicy" (Sarcastic) or "Nuclear" (Destructive).
- **Real Analysis:** Reads repo metadata and latest commits.
- **JSON Mode:** Structured and consistent responses thanks to Gemini Flash.

---