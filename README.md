# NutriSync AI 🥗⚡
> **Next-Gen Multimodal AI Health, Nutrition & Fitness Companion**

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Gemini API](https://img.shields.io/badge/Google_Gemini-3.8--Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-Mobile_Native-119EFF?style=flat-square&logo=capacitor)](https://capacitorjs.com/)
[![Vercel](https://img.shields.io/badge/Deployment-Vercel_Free-000000?style=flat-square&logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

**NutriSync AI** is a full-stack, cross-platform mobile application that transforms daily health management using multimodal AI capabilities. Driven by Google's **Gemini 3.8 Flash** model, NutriSync AI seamlessly converts meal photos and voice dictations into granular macro/micronutrient tracking, adapts daily workout intensity through biometric feedback loops, generates custom multi-day meal plans with dynamic grocery lists, and tracks progress with gamified streak mechanics.

---

## 🌟 Key Features

### 📸 Multimodal Food & Macro Scanner
* **Visual Calorie & Macro Estimation:** Snap a picture of any meal to instantly receive a structured breakdown of total calories, macronutrients (proteins, carbs, fats), and essential vitamins.
* **Health Scoring:** Every scanned meal receives an objective AI Health Score (1–100) with key dietary takeaways.

### ✏️ Ingredient Editor & Override
* **Hidden Ingredient Correction:** Never get tripped up by invisible oils, butter, or sauces. Manually tweak portions or inject missing hidden ingredients directly into the AI's calculation box before logging.

### 🎙️ Voice-Based Food & Workout Logging
* **Natural Language Dictation:** Speak complex, multi-item logs (e.g., *"I had three poached eggs, a slice of sourdough with avocado for breakfast, then completed a 4-mile run in 32 minutes"*).
* **Automated Parsing:** Gemini dynamically parses and routes food items to the nutrition journal and physical activity to the workout log in a single step.

### 🥗 Advanced Meal Planning & Auto Grocery List
* **Macro-Targeted Multi-Day Generator:** Generates structured 7-day meal plans aligned with user-defined fitness goals (fat loss, muscle hypertrophy, keto, vegan, etc.).
* **Categorized Shopping List:** Aggregates ingredients across all scheduled meals into a organized grocery list (Produce, Proteins, Pantry, Dairy) to eliminate food waste.
* **Dynamic Recalibration:** Swapping or skipping a meal automatically recalibrates the remaining days to keep overall weekly macro targets intact.

### 🔄 Biometric Feedback Loop
* **Adaptive Intensity Coaching:** Reads passive wearable metrics (sleep duration, sleep quality rating, and daily step totals) to dynamically scale daily workout difficulty—recommending active recovery when rest is suboptimal or high intensity when fully charged.

### 📅 Smart Workout Scheduling & Calendar
* **Unified Health Calendar:** Integrated planning view combining scheduled daily workouts, recurring exercise routines, and structured meal timing.

### 💧 Hydration & Gamified Streaks
* **Quick-Tap Water Tracker:** Interactive visual widget for rapid logging of daily water intake goals.
* **Retention Engine:** Daily streak counter (`🔥 streak_count`) that increments when users meet logging and health activity thresholds.

### 📊 Daily AI Health Score & Coach Share Cards
* **End-of-Day Synthesis:** Gemini reviews daily total intake, workouts, sleep quality, and steps to compute an overall Daily Health Score (0–100).
* **Exportable Progress Cards:** Render high-resolution summary cards formatted for social media sharing or personal coach reviews.

---

## 🛠️ Architecture & Tech Stack

NutriSync AI is engineered to run **100% on free-tier cloud infrastructure** without sacrificing production performance or native device capabilities.

```
+-------------------------------------------------------------------+
|                        NutriSync AI App                           |
|      (Next.js App Router + Tailwind CSS + Shadcn UI + PWA)         |
+-------------------------------------------------------------------+
|                     Capacitor Mobile Bridge                       |
|          (Native Camera API / Microphone / File System)           |
+-------------------------------------------------------------------+
                                 |
                 +---------------+---------------+
                 |                               |
                 v                               v
    +-------------------------+     +-------------------------+
    |   Google Gemini API     |     |    Supabase Cloud       |
    |   (gemini-3.8-flash)    |     |  - PostgreSQL Database  |
    |  - Vision Analysis      |     |  - Row-Level Auth       |
    |  - Natural Voice NLP    |     |  - Media Storage Bucket |
    |  - Meal Plan Engine     |     +-------------------------+
    +-------------------------+                  |
                 |                               |
                 +---------------+---------------+
                                 |
                                 v
                    +-------------------------+
                    |     Vercel Hosting      |
                    |   (Edge Deployment)     |
                    +-------------------------+
```

| Layer | Technology | Infrastructure Provider | Cost Tier |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | Next.js 15 (React 19) | [Vercel](https://vercel.com) | **Free** |
| **Mobile Runtime** | Capacitor 6 | iOS / Android Native Shell | **Free** |
| **Database & Auth** | PostgreSQL / Row-Level Security | [Supabase](https://supabase.com) | **Free** |
| **Media Storage** | Supabase Storage Buckets | [Supabase](https://supabase.com) | **Free** |
| **AI Processing Engine** | Gemini API (`gemini-3.8-flash`) | [Google AI Studio](https://aistudio.google.com/) | **Free** |
| **Component Library** | Tailwind CSS + Shadcn UI | Open Source | **Free** |

---

## 🗄️ Database Schema (Supabase PostgreSQL)

Execute the following DDL script in your Supabase SQL Editor to set up the relational database schema:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  daily_calorie_goal INT DEFAULT 2000,
  daily_step_goal INT DEFAULT 10000,
  water_goal_ml INT DEFAULT 2500,
  streak_count INT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meals Table
CREATE TABLE public.meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT,
  food_name TEXT NOT NULL,
  calories INT NOT NULL,
  protein FLOAT DEFAULT 0.0,
  carbs FLOAT DEFAULT 0.0,
  fats FLOAT DEFAULT 0.0,
  micronutrients JSONB DEFAULT '[]'::jsonb,
  ingredients JSONB DEFAULT '[]'::jsonb,
  health_score INT DEFAULT 80,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workouts Table
CREATE TABLE public.workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INT NOT NULL,
  calories_burned INT DEFAULT 0,
  scheduled_date DATE DEFAULT CURRENT_DATE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meal Plans Table
CREATE TABLE public.meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  week_start_date DATE NOT NULL,
  plan_data JSONB NOT NULL,
  grocery_list JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Biometrics Table
CREATE TABLE public.biometrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  sleep_hours FLOAT DEFAULT 8.0,
  sleep_quality TEXT CHECK (sleep_quality IN ('Poor', 'Fair', 'Good', 'Excellent')),
  steps_taken INT DEFAULT 0,
  recorded_date DATE DEFAULT CURRENT_DATE,
  UNIQUE(user_id, recorded_date)
);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometrics ENABLE ROW LEVEL SECURITY;

-- Basic Policies
CREATE POLICY "Users can manage their own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage their own meals" ON public.meals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own workouts" ON public.workouts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own meal plans" ON public.meal_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own biometrics" ON public.biometrics FOR ALL USING (auth.uid() = user_id);
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory of your project:

```env
# Google Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed locally:
* **Node.js:** `v18.x` or `v20.x`
* **npm** or **pnpm**
* **Android Studio** (for Android build testing)
* **Xcode** (for iOS build testing, macOS required)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/nutrisync-ai.git
cd nutrisync-ai

# Install dependencies
npm install
```

### 3. Local Development
```bash
# Start Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to inspect the application.

---

## 📱 Mobile Build & Capacitor Deployment

### Static Export Configuration
Ensure `next.config.js` is set to static export mode:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
};

module.exports = nextConfig;
```

### Capacitor Setup Commands
```bash
# Initialize Capacitor
npx cap init NutriSync com.nutrisync.app

# Add Android & iOS platforms
npx cap add android
npx cap add ios

# Build Next.js static files and sync with native builds
npm run build
npx cap sync
```

### Testing on Physical Hardware

#### Android
1. Open Android Studio:
   ```bash
   npx cap open android
   ```
2. Connect your Android device via USB with **USB Debugging** enabled in Developer Options.
3. Select your phone in the top bar and click **Run (Shift + F10)**.

#### iOS
1. Open Xcode:
   ```bash
   npx cap open ios
   ```
2. Connect your iPhone via USB.
3. Select your signing development team under project settings and click **Play (Cmd + R)**.

---

## 🌐 Production Cloud Deployment (100% Free)

1. **Database Hosting (Supabase):**
   * Create a free project at [supabase.com](https://supabase.com).
   * Run the SQL schema script provided above.
   * Enable Google or Email Auth under Authentication settings.

2. **Web Hosting (Vercel):**
   * Push your project code to GitHub.
   * Connect your GitHub repo to [Vercel](https://vercel.com).
   * Inject environment variables (`GEMINI_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
   * Deploy! Your app will be accessible globally via HTTPS.

---

## 🗺️ Future Roadmap (V2)
* [ ] **Apple HealthKit & Google Health Connect Sync:** Automatic background synchronization of active calories, resting heart rate, and sleep stages.
* [ ] **Barcode & Nutritional Label OCR:** Secondary barcode scanning fallback for packaged items.
* [ ] **AI Grocery Order Integration:** Direct cart population on delivery platforms (e.g., Instacart / local grocery APIs).
* [ ] **Social Leaderboards:** Weekly streak competitions and workout challenge sharing.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
