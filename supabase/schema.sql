-- Theraria / NutriSync AI starter schema.
-- Review this file before applying it to a real project. Disease and health scoring
-- columns are placeholders; this schema does not implement a clinical methodology.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.profiles (
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
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.meals (
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.foods (
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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INT NOT NULL,
  calories_burned INT DEFAULT 0,
  scheduled_date DATE DEFAULT CURRENT_DATE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  week_start_date DATE NOT NULL,
  plan_data JSONB NOT NULL,
  grocery_list JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  ingredients JSONB NOT NULL,
  steps JSONB NOT NULL,
  estimated_calories INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.biometrics (
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

CREATE TABLE IF NOT EXISTS public.disease_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  risk_level TEXT CHECK (risk_level IN ('Low', 'Moderate', 'High')),
  total_disease_points INT DEFAULT 0,
  evaluated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index common user/date reads. Review against actual query patterns before launch.
CREATE INDEX IF NOT EXISTS meals_user_created_at_idx ON public.meals(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS workouts_user_scheduled_date_idx ON public.workouts(user_id, scheduled_date);
CREATE INDEX IF NOT EXISTS biometrics_user_recorded_date_idx ON public.biometrics(user_id, recorded_date DESC);
CREATE INDEX IF NOT EXISTS meal_plans_user_week_start_idx ON public.meal_plans(user_id, week_start_date DESC);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biometrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_categories ENABLE ROW LEVEL SECURITY;

-- Create a minimal profile when Supabase Auth creates a user. This privileged trigger
-- uses the Auth record as the source of email/provider; client sessions cannot forge
-- subscription_tier or ai_credits_remaining during profile insertion.
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, auth_provider)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url',
    COALESCE(NEW.raw_app_meta_data ->> 'provider', 'email')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- Authenticated sessions may read their own profile and update ordinary preferences,
-- but cannot insert/delete profiles or change server-managed billing/credit columns.
REVOKE INSERT, UPDATE, DELETE ON TABLE public.profiles FROM anon, authenticated;
GRANT SELECT ON TABLE public.profiles TO authenticated;
GRANT UPDATE (full_name, avatar_url, weight_kg, height_cm, age,
  daily_calorie_goal, daily_step_goal, water_goal_ml, streak_count, updated_at)
  ON TABLE public.profiles TO authenticated;

-- Re-runnable policy declarations. These policies bind reads AND writes to auth.uid().
DROP POLICY IF EXISTS "Users can manage their own profile" ON public.profiles;
CREATE POLICY "Users can manage their own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can manage their own meals" ON public.meals;
CREATE POLICY "Users can manage their own meals" ON public.meals
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- The global catalog is readable by signed-in and anonymous users, but this starter
-- intentionally grants no client-side insert/update/delete policy.
DROP POLICY IF EXISTS "Anyone can read foods" ON public.foods;
CREATE POLICY "Anyone can read foods" ON public.foods
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage their own workouts" ON public.workouts;
CREATE POLICY "Users can manage their own workouts" ON public.workouts
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own meal plans" ON public.meal_plans;
CREATE POLICY "Users can manage their own meal plans" ON public.meal_plans
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own recipes" ON public.recipes;
CREATE POLICY "Users can manage their own recipes" ON public.recipes
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own biometrics" ON public.biometrics;
CREATE POLICY "Users can manage their own biometrics" ON public.biometrics
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own disease categories" ON public.disease_categories;
CREATE POLICY "Users can manage their own disease categories" ON public.disease_categories
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
