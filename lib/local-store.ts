import { STORAGE_KEY } from "./seed-data";
import type { LocalState } from "./types";

export function loadLocalState(fallback: LocalState): LocalState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object") return fallback;
    const saved = value as Partial<LocalState>;
    return {
      ...fallback,
      ...saved,
      meals: Array.isArray(saved.meals) ? saved.meals : fallback.meals,
      workouts: Array.isArray(saved.workouts) ? saved.workouts : fallback.workouts,
      planMeals: Array.isArray(saved.planMeals) ? saved.planMeals : fallback.planMeals,
      macroGoals: saved.macroGoals && typeof saved.macroGoals === "object" ? { ...fallback.macroGoals, ...saved.macroGoals } : fallback.macroGoals,
      hydrationMl: Number.isFinite(saved.hydrationMl) ? Number(saved.hydrationMl) : fallback.hydrationMl,
      waterGoalMl: Number.isFinite(saved.waterGoalMl) ? Number(saved.waterGoalMl) : fallback.waterGoalMl,
      hydrationStreak: Number.isFinite(saved.hydrationStreak) ? Number(saved.hydrationStreak) : fallback.hydrationStreak,
      hydrationStreakDate: typeof saved.hydrationStreakDate === "string" ? saved.hydrationStreakDate : fallback.hydrationStreakDate,
      calorieGoal: Number.isFinite(saved.calorieGoal) ? Number(saved.calorieGoal) : fallback.calorieGoal,
      goal: typeof saved.goal === "string" ? saved.goal : fallback.goal,
    };
  } catch {
    return fallback;
  }
}

export function saveLocalState(value: LocalState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Keep the local demo usable when browser storage is blocked or full.
  }
}
