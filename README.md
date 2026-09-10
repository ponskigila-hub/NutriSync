# NutriSync AI 🥗⚡
> **Next-Gen Multimodal AI Health, Nutrition & Fitness Companion**

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Gemini API](https://img.shields.io/badge/Google_Gemini-3.8--Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-Mobile_Native-119EFF?style=flat-square&logo=capacitor)](https://capacitorjs.com/)
[![Google Health Connect](https://img.shields.io/badge/Google-Health_Connect-34A853?style=flat-square&logo=android)](https://developer.android.com/health-and-fitness/guides/health-connect)
[![Apple HealthKit](https://img.shields.io/badge/Apple-HealthKit-000000?style=flat-square&logo=apple)](https://developer.apple.com/healthkit/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

**NutriSync AI** is a full-stack, cross-platform mobile application that transforms daily health management using multimodal AI capabilities and native biometric integrations. Powered by Google's **Gemini 3.8 Flash** model, NutriSync AI seamlessly converts meal photos and voice dictations into granular macro/micronutrient tracking, passively synchronizes biometrics with **Google Health Connect** and **Apple HealthKit**, supports seamless **Google** and **Apple** social authentication, and adapts daily workout intensity through intelligent feedback loops.

---

## 🌟 Key Features

### 🔐 OAuth & Native Social Login
* **One-Tap Authentication:** Native **Google Sign-In** and **Sign in with Apple** via Capacitor social authentication and Supabase Auth integration.
* **Cross-Platform Support:** Unified user profile session sync across iOS, Android, and Web browsers.

### 📲 Passive Biometric Sync (Google Health Connect & Apple HealthKit)
* **Automatic Wearable Sync:** Real-time passive sync for steps, active energy burned, resting heart rate, and sleep metrics using `@capgo/capacitor-health`.
* **Zero-Effort Data Ingestion:** Eliminates manual biometric logging by directly reading authorized hardware data from Apple Watch, Galaxy Watch, Fitbit, Pixel Watch, and Wear OS devices.

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
* **Categorized Shopping List:** Aggregates ingredients across all scheduled meals into an organized grocery list (Produce, Proteins, Pantry, Dairy) to eliminate food waste.
* **Dynamic Recalibration:** Swapping or skipping a meal automatically recalibrates the remaining days to keep overall weekly macro targets intact.

### 🔄 Adaptive Biometric Feedback Loop
* **AI Intensity Coaching:** Combines synced HealthKit/Health Connect metrics (sleep quality, HRV, step counts) to dynamically scale daily workout difficulty—recommending active recovery when rest is suboptimal or higher intensity when fully charged.

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
+-----------------------------------------------------------------------------------+
|                                NutriSync AI App                                   |
|               (Next.js App Router + Tailwind CSS + Shadcn UI + PWA)                |
+-----------------------------------------------------------------------------------+
|                             Capacitor Mobile Bridge                               |
|        (Native Camera / Mic / Social Auth / HealthKit / Health Connect)           |
+-----------------------------------------------------------------------------------+
           |                                     |                              |
           v                                     v                              v
+-----------------------+             +----------------------+      +-----------------------+
|  Apple HealthKit      |             | Google HealthConnect |      | Google / Apple OAuth  |
|  (iOS Biometrics)     |             | (Android Biometrics) |      | (Supabase Auth Engine)|
+-----------------------+             +----------------------+      +-----------------------+
           |                                     |                              |
           +-----------------+-------------------+                              |
                             |                                                  |
                             v                                                  v
                +-------------------------+                        +-------------------------+
                |   Google Gemini API     |                        |    Supabase Cloud       |
                |   (gemini-3.8-flash)    |                        |  - PostgreSQL Database  |
                |  - Vision & NLP Engine  |                        |  - Row-Level Security   |
                |  - Adaptive Coaching    |                        |  - Media Storage        |
                +-------------------------+                        +-------------------------+
                             |                                                  |
                             +-------------------------+------------------------+
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
| **Biometrics Integration** | `@capgo/capacitor-health` | Apple HealthKit & Google Health Connect | **Free** |
| **Social Authentication** | `@capgo/capacitor-social-login` | Google Sign-In & Sign in with Apple | **Free** |
| **Database & Auth Engine** | PostgreSQL / Row-Level Security | [Supabase](https://supabase.com) | **Free** |
| **AI Processing Engine** | Gemini API (`gemini-3.8-flash`) | [Google AI Studio](https://aistudio.google.com/) | **Free** |
| **Component Library** | Tailwind CSS + Shadcn UI | Open Source | **Free** |

---

## 🗄️ Database Schema (Supabase PostgreSQL)

Execute the following DDL script in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User Profiles Table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  auth_provider TEXT DEFAULT 'email',
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

-- Biometrics Table (HealthKit / Health Connect Data Sync)
CREATE TABLE public.biometrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  sleep_hours FLOAT DEFAULT 8.0,
  sleep_quality TEXT CHECK (sleep_quality IN ('Poor', 'Fair', 'Good', 'Excellent')),
  steps_taken INT DEFAULT 0,
  active_calories INT DEFAULT 0,
  resting_hr INT DEFAULT 0,
  source TEXT CHECK (source IN ('Apple HealthKit', 'Google Health Connect', 'Manual')),
  recorded_date DATE DEFAULT CURRENT_DATE,
  UNIQUE(user_id, recorded_date)
);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometrics ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies
CREATE POLICY "Users can manage their own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage their own meals" ON public.meals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own workouts" ON public.workouts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own meal plans" ON public.meal_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own biometrics" ON public.biometrics FOR ALL USING (auth.uid() = user_id);
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# OAuth Credentials
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_web_client_id.apps.googleusercontent.com
NEXT_PUBLIC_APPLE_CLIENT_ID=com.nutrisync.app.client
```

---

## 📱 Native Platform Configuration

### iOS Configuration (`ios/App/App/Info.plist`)
```xml
<!-- HealthKit Permissions -->
<key>NSHealthShareUsageDescription</key>
<string>NutriSync AI requires read access to your steps, sleep, and heart rate data to customize workout plans.</string>
<key>NSHealthUpdateUsageDescription</key>
<string>NutriSync AI requires write access to log workout sessions to Apple Health.</string>

<!-- Google Sign-In URL Scheme -->
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.googleusercontent.apps.YOUR_REVERSED_CLIENT_ID</string>
    </array>
  </dict>
</array>
```

### Android Configuration (`android/app/src/main/AndroidManifest.xml`)
```xml
<!-- Health Connect Permissions -->
<uses-permission android:name="android.permission.health.READ_STEPS" />
<uses-permission android:name="android.permission.health.READ_SLEEP" />
<uses-permission android:name="android.permission.health.READ_EXERCISE" />
<uses-permission android:name="android.permission.health.READ_HEART_RATE" />
<uses-permission android:name="android.permission.health.READ_ACTIVE_CALORIES_BURNED" />

<queries>
  <package android:name="com.google.android.apps.healthdata" />
</queries>
```

---

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed locally:
* **Node.js:** `v18.x` or `v20.x`
* **Android Studio:** With Health Connect SDK (Android 8.0 / API 26+)
* **Xcode:** With HealthKit and Sign in with Apple capabilities enabled

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/your-username/nutrisync-ai.git
cd nutrisync-ai

# Install dependencies including Native Health & Social Login plugins
npm install
npm install @capgo/capacitor-health @capgo/capacitor-social-login
```

### 3. Local Development
```bash
# Start Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to test web flows.

---

## 📱 Mobile Build & Capacitor Deployment

```bash
# Sync Next.js build with iOS and Android native platforms
npm run build
npx cap sync
```

### Running Hardware Builds

#### Android (Health Connect & Google Auth)
```bash
npx cap open android
```
1. Enable **Developer Options** and **USB Debugging** on your phone.
2. In Android Studio, select your physical device and press **Run**. Ensure Google Health Connect app permissions are granted.

#### iOS (Apple HealthKit & Apple Sign-In)
```bash
npx cap open ios
```
1. Enable **HealthKit** and **Sign in with Apple** under **Signing & Capabilities** in Xcode.
2. Select your device and press **Play (Cmd + R)**.

---

## 🌐 Production Cloud Deployment (100% Free)

1. **Supabase Setup:** Configure **Google** and **Apple** OAuth providers under *Authentication > Providers* in the Supabase Dashboard.
2. **Vercel Deployment:** Push to GitHub, import to Vercel, and configure environment variables.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).