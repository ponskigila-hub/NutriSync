import { FOOD_CATALOG } from "./seed-data";
import type { Food, Meal } from "./types";

export interface NutritionEstimate {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  micros: string[];
  ingredients: string[];
}

const fallbackEstimate: NutritionEstimate = {
  calories: 320,
  protein: 18,
  carbs: 40,
  fats: 10,
  fiber: 6,
  micros: ["Fiber", "Iron"],
  ingredients: ["User-entered food"],
};

function findFood(text: string): Food | undefined {
  const query = text.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
  if (!query) return undefined;
  return FOOD_CATALOG.find((food) => {
    const name = food.name.toLowerCase();
    const key = food.id.toLowerCase().replace(/-/g, " ");
    return query.includes(name) || name.split(/[,&]/).some((part) => part.trim().length > 4 && query.includes(part.trim())) || query.includes(key);
  });
}

export function estimateFood(text: string, servings: number, extraOil: boolean): NutritionEstimate {
  const match = findFood(text);
  const base: NutritionEstimate = match
    ? { calories: match.calories, protein: match.protein, carbs: match.carbs, fats: match.fats, fiber: match.fiber, micros: ["Fiber", "Vitamin C", "Calcium"], ingredients: [match.name] }
    : fallbackEstimate;
  const portion = Math.max(0.25, Math.min(5, servings || 1));
  const oilCalories = extraOil ? 120 : 0;
  return {
    calories: Math.round(base.calories * portion + oilCalories),
    protein: Math.round(base.protein * portion),
    carbs: Math.round(base.carbs * portion),
    fats: Math.round(base.fats * portion + (extraOil ? 14 : 0)),
    fiber: Math.round(base.fiber * portion),
    micros: match ? ["Fiber", "Vitamin C", "Calcium"] : base.micros,
    ingredients: match ? [match.name.split(" ").slice(0, 3).join(" "), ...(extraOil ? ["Added oil (manual estimate)"] : [])] : [...base.ingredients, ...(extraOil ? ["Added oil (manual estimate)"] : [])],
  };
}

export function scoreMeal(estimate: NutritionEstimate): number {
  // A deliberately simple sample-only heuristic; it is not clinically validated.
  return Math.max(55, Math.min(96, Math.round(61 + estimate.protein / 4 + estimate.fiber * 1.4 - estimate.fats / 14)));
}

export function totalsFor(meals: Meal[]) {
  return meals.reduce((totals, meal) => ({
    calories: totals.calories + meal.calories,
    protein: totals.protein + meal.protein,
    carbs: totals.carbs + meal.carbs,
    fats: totals.fats + meal.fats,
    fiber: totals.fiber + meal.fiber,
  }), { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 });
}

export function dayKey(value: string): string {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
