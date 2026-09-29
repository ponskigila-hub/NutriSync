export type Section = "overview" | "meals" | "plans" | "activity" | "foods" | "coach" | "share";
export type MealSource = "Photo" | "Voice" | "Manual";
export type PlanStatus = "planned" | "skipped";

export interface Meal {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  micros: string[];
  ingredients: string[];
  healthScore: number;
  healthPoints: number;
  diseasePoints: number;
  source: MealSource;
  createdAt: string;
}

export interface Workout {
  id: string;
  title: string;
  durationMinutes: number;
  caloriesBurned: number;
  scheduledDate: string;
  completed: boolean;
}

export interface PlanMeal {
  id: string;
  day: string;
  meal: string;
  name: string;
  calories: number;
  protein: number;
  status: PlanStatus;
}

export interface MacroGoals {
  protein: number;
  carbs: number;
  fats: number;
}

export interface LocalState {
  meals: Meal[];
  hydrationMl: number;
  waterGoalMl: number;
  hydrationStreak: number;
  hydrationStreakDate: string | null;
  calorieGoal: number;
  macroGoals: MacroGoals;
  workouts: Workout[];
  goal: string;
  planMeals: PlanMeal[];
}

export interface Food {
  id: string;
  name: string;
  description: string;
  type: string;
  origin: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  benefits: string;
  drawbacks: string;
  healthPoints: number;
  diseasePoints: number;
  cholesterolCategory: "Low" | "Moderate" | "High";
}
