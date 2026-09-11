# Theraria (NutriSync AI) 🥗⚡
> **Next-Gen Multimodal AI Health, Nutrition & Fitness Companion**

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-Expo-000020?style=flat-square&logo=expo)](https://expo.dev/)
[![Gemini API](https://img.shields.io/badge/Google_Gemini-3.8--Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Capacitor](https://img.shields.io/badge/Capacitor-Mobile_Native-119EFF?style=flat-square&logo=capacitor)](https://capacitorjs.com/)
[![Google Health Connect](https://img.shields.io/badge/Google-Health_Connect-34A853?style=flat-square&logo=android)](https://developer.android.com/health-and-fitness/guides/health-connect)
[![Apple HealthKit](https://img.shields.io/badge/Apple-HealthKit-000000?style=flat-square&logo=apple)](https://developer.apple.com/healthkit/)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

**Theraria** (from *Therapeuo* — merawat, melayani, menyembuhkan — and *Soteria* — keselamatan/kesehatan), also known as **NutriSync AI**, is a full-stack, cross-platform application that transforms daily health management using multimodal AI. It tracks your daily meals to tell you whether they're healthy or not, converts meal photos and voice dictations into granular macro/micronutrient tracking, passively syncs biometrics with **Google Health Connect** and **Apple HealthKit**, supports **Google** and **Apple** social authentication, and adapts daily workout intensity through intelligent feedback loops — all powered by the **Gemini API**.

---

## 🌟 Key Features

### 🍽️ Food Tracker (Core)
* **Daily Health Verdict:** Tracks every meal you eat and tells you, day by day, whether your overall intake is healthy or not.
* **Health Points System:** Every food item carries **health points** and **disease points**, aggregated into daily/weekly/monthly summaries.
* **Disease Category Detection:** Surfaces relevant risk categories based on accumulated disease points and food history.

### 🩺 Cholesterol & Diabetes Detector (AI-Integrated)
* **AI Cholesterol Estimation:** Estimates calories from food consumed, then derives a cholesterol-style score/points (requires further research into a sound scoring methodology).
* **Diabetes Detector:** Ask-AI flow that flags foods/patterns of concern for blood sugar management.
* **Personalized Advice:** Recommends what to eat next based on current cholesterol/diabetes indicators.
* **Cholesterol Table:** Visual reference table (high/low) that can be tracked over time.
* **Macro Breakdown:** Detects daily protein, fat, and carbohydrate intake automatically.

### 🔐 OAuth & Native Social Login
* **One-Tap Authentication:** Native **Google Sign-In** and **Sign in with Apple** via Capacitor social authentication and Supabase Auth.
* **Cross-Platform Support:** Unified user profile session sync across iOS, Android, and Web.
* Dedicated **Sign In / Sign Up** flow for the Food Tracker app.

### 📲 Passive Biometric Sync (Google Health Connect & Apple HealthKit)
* **Automatic Wearable Sync:** Real-time passive sync for steps, active energy burned, resting heart rate, and sleep metrics via `@capgo/capacitor-health`.
* **Zero-Effort Data Ingestion:** Reads authorized hardware data from Apple Watch, Galaxy Watch, Fitbit, Pixel Watch, and Wear OS devices — no manual logging required.

### 📸 Multimodal Food & Macro Scanner
* **Visual Calorie & Macro Estimation:** Snap a photo of any meal to get a structured breakdown of calories, macronutrients, and essential vitamins.
* **Health Scoring:** Every scanned meal receives an objective AI Health Score (1–100) with key dietary takeaways.
* **Privacy-First Uploads:** Uploaded food photos are analyzed and matched against the detectors, then discarded — only the AI-generated food data is persisted to the database, not the image itself.
* **Type-or-Snap:** Log meals either by uploading a photo or typing them out; both routes go through the same AI pipeline.

### ✏️ Ingredient Editor & Override
* **Hidden Ingredient Correction:** Never get tripped up by invisible oils, butter, or sauces. Manually tweak portions or inject missing hidden ingredients directly into the AI's calculation before logging.

### 🎙️ Voice-Based Food & Workout Logging
* **Natural Language Dictation:** Speak complex, multi-item logs (e.g., *"I had three poached eggs, a slice of sourdough with avocado for breakfast, then completed a 4-mile run in 32 minutes"*).
* **Automated Parsing:** Gemini dynamically parses and routes food items to the nutrition journal and physical activity to the workout log in a single step.

### 🥗 Advanced Meal Planning, Recipe Maker & Auto Grocery List
* **AI Food Planner:** Generates a meal plan for the day/week based on calorie targets and health points.
* **Macro-Targeted Multi-Day Generator:** Generates structured 7-day meal plans aligned with fitness goals (fat loss, muscle hypertrophy, keto, vegan, etc.).
* **AI Recipe Maker:** Ask-AI flow that generates recipes tailored to the user's goals and available ingredients.
* **Categorized Shopping List:** Aggregates ingredients across all scheduled meals into an organized grocery list (Produce, Proteins, Pantry, Dairy).
* **Dynamic Recalibration:** Swapping or skipping a meal automatically recalibrates remaining days to keep weekly macro targets intact.

### 📚 Food List / Database (API or Ask-AI)
* Searchable catalog of foods, each with: description, calories (protein/carb/fat breakdown), type, origin, benefits, and drawbacks.
* Every entry carries its own **health points** and **disease points**, feeding into the tracker and disease-category logic.

### 🔄 Adaptive Biometric Feedback Loop
* **AI Intensity Coaching:** Combines synced HealthKit/Health Connect metrics (sleep quality, HRV, step counts) to dynamically scale daily workout difficulty — recommending active recovery when rest is suboptimal, or higher intensity when fully charged.

### 📅 Smart Workout Scheduling & Calendar
* **Unified Health Calendar:** Integrated planning view combining scheduled daily workouts, recurring exercise routines, and structured meal timing.

### 💧 Hydration & Gamified Streaks
* **Quick-Tap Water Tracker:** Interactive visual widget for rapid logging of daily water intake goals.
* **Retention Engine:** Daily streak counter (`🔥 streak_count`) that increments when users meet logging and health activity thresholds.

### 📊 Daily AI Health Score, Calorie Tracker & Coach Share Cards
* **End-of-Day Synthesis:** Gemini reviews daily total intake, workouts, sleep quality, and steps to compute an overall Daily Health Score (0–100).
* **Calorie Tracker:** Calculates targets and progress based on the user's weight, height, and age.
* **Exportable Progress Cards:** Render high-resolution summary cards formatted for social media sharing or personal coach review.

### 💳 Subscription & Credits
* **Credit-Limited AI Usage:** Free tier includes a limited number of AI credits (e.g., photo uploads/analyses); subscription tiers unlock additional credits.

---

## 🛠️ Architecture & Tech Stack

Theraria is engineered to run on free-tier cloud infrastructure where possible, without sacrificing production performance or native device capabilities. The project supports two front-end distributions sharing the same backend.

```
+-----------------------------------------------------------------------------------+
|                                   Theraria App                                    |
|   Frontend (Mobile): React Native (Expo)   |   Frontend (Web): Next.js + PWA      |
|                  Styling: Tailwind CSS / NativeWind + Shadcn UI                   |
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
                |  - Adaptive Coaching    |                        |  - Edge Functions (API) |
                |  - Cholesterol/Diabetes |                        |  - Storage              |
                |    Detection & Advice   |                        |                          |
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

| Distribution | Tech Stack | Role | Cost Tier |
| :--- | :--- | :--- | :--- |
| **Frontend (Mobile)** | React Native (Expo) + Capacitor | UI for Dashboard & native device access | **Free** |
| **Frontend (Web)** | Next.js 15 (React 19) | UI for Dashboard / PWA | **Free** |
| **Backend & API** | Supabase Edge Functions | Server-side logic, AI orchestration | **Free** |
| **Authentication** | Supabase Auth (Google / Apple OAuth) | Sign in / Sign up | **Free** |
| **Styling** | Tailwind CSS / NativeWind + Shadcn UI | Design system | **Free** |
| **Database** | PostgreSQL (Supabase), Row-Level Security | Persistent storage | **Free** |
| **AI Engine** | Gemini API (`gemini-3.8-flash`) | Vision, NLP, coaching, detectors | **Free** |
| **File Storage** | Supabase Storage | Media handling (transient food images) | **Free** |
| **Biometrics Integration** | `@capgo/capacitor-health` | Apple HealthKit & Google Health Connect | **Free** |
| **Social Authentication** | `@capgo/capacitor-social-login` | Google Sign-In & Sign in with Apple | **Free** |
| **Design** | Figma | UI/UX design | **Free** |
| **Hosting** | Vercel | Edge deployment | **Free** |

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
  weight_kg FLOAT,
  height_cm FLOAT,
  age INT,
  daily_calorie_goal INT DEFAULT 2000,
  daily_step_goal INT DEFAULT 10000,
  water_goal_ml INT DEFAULT 2500,
  streak_count INT DEFAULT 0,
  subscription_tier TEXT DEFAULT 'free',
  ai_credits_remaining INT DEFAULT 10,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meals Table
CREATE TABLE public.meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  food_name TEXT NOT NULL,
  calories INT NOT NULL,
  protein FLOAT DEFAULT 0.0,
  carbs FLOAT DEFAULT 0.0,
  fats FLOAT DEFAULT 0.0,
  micronutrients JSONB DEFAULT '[]'::jsonb,
  ingredients JSONB DEFAULT '[]'::jsonb,
  health_score INT DEFAULT 80,
  health_points INT DEFAULT 0,
  disease_points INT DEFAULT 0,
  source TEXT CHECK (source IN ('Photo', 'Voice', 'Manual')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Note: meal photos are analyzed transiently and are NOT persisted;
-- only the AI-derived food data above is stored.

-- Food Reference List (catalog)
CREATE TABLE public.foods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  type TEXT,
  origin TEXT,
  calories INT NOT NULL,
  protein FLOAT DEFAULT 0.0,
  carbs FLOAT DEFAULT 0.0,
  fats FLOAT DEFAULT 0.0,
  benefits TEXT,
  drawbacks TEXT,
  health_points INT DEFAULT 0,
  disease_points INT DEFAULT 0,
  cholesterol_level TEXT CHECK (cholesterol_level IN ('Low', 'Moderate', 'High')),
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

-- Recipes Table (AI Recipe Maker)
CREATE TABLE public.recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  ingredients JSONB NOT NULL,
  steps JSONB NOT NULL,
  estimated_calories INT,
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

-- Disease Risk Categories Table
CREATE TABLE public.disease_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL, -- e.g. 'Cholesterol Risk', 'Diabetes Risk'
  risk_level TEXT CHECK (risk_level IN ('Low', 'Moderate', 'High')),
  total_disease_points INT DEFAULT 0,
  evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_categories ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies
CREATE POLICY "Users can manage their own profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users can manage their own meals" ON public.meals FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own workouts" ON public.workouts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own meal plans" ON public.meal_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own recipes" ON public.recipes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own biometrics" ON public.biometrics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own disease categories" ON public.disease_categories FOR ALL USING (auth.uid() = user_id);
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
NEXT_PUBLIC_APPLE_CLIENT_ID=com.theraria.app.client
```

---

## 📱 Native Platform Configuration

### iOS Configuration (`ios/App/App/Info.plist`)
```xml
<!-- HealthKit Permissions -->
<key>NSHealthShareUsageDescription</key>
<string>Theraria requires read access to your steps, sleep, and heart rate data to customize workout plans.</string>
<key>NSHealthUpdateUsageDescription</key>
<string>Theraria requires write access to log workout sessions to Apple Health.</string>

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
* **Expo CLI** (for the React Native mobile app)
* **Android Studio:** With Health Connect SDK (Android 8.0 / API 26+)
* **Xcode:** With HealthKit and Sign in with Apple capabilities enabled

### 2. Installation

**Web (Next.js):**
```bash
git clone https://github.com/your-username/theraria.git
cd theraria/web
npm install
npm install @capgo/capacitor-health @capgo/capacitor-social-login
```

**Mobile (React Native / Expo):**
```bash
cd theraria/mobile
npm install
npx expo install
```

### 3. Local Development
```bash
# Web
npm run dev
# Open http://localhost:3000

# Mobile
npx expo start
```

---

## 📱 Mobile Build & Capacitor Deployment (Web-based native shell)

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
3. **Expo / EAS Build:** Use EAS Build to produce distributable mobile binaries for the React Native app.

---

## 🗺️ Roadmap / Open Research Items

* [ ] Research and define a sound methodology for the AI-derived **cholesterol points** scoring system.
* [ ] Define the **health points** / **disease points** weighting model used across `meals`, `foods`, and `disease_categories`.
* [ ] Design the **subscription & credit** system (tiers, credit costs per AI action, upgrade flow).
* [ ] Build out the **Food List** catalog (sourced from a public API and/or AI-generated entries).
* [ ] Finalize Figma designs for mobile and web dashboards.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).