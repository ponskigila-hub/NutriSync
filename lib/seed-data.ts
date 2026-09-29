import type { Food, LocalState, PlanMeal } from "./types";

export const STORAGE_KEY = "theraria-demo-v1";

export const FOOD_CATALOG: Food[] = [
  { id: "yogurt", name: "Greek yogurt with berries & oats", description: "Creamy yogurt, seasonal berries, rolled oats, and chia.", type: "Breakfast", origin: "Mediterranean-inspired", calories: 380, protein: 28, carbs: 48, fats: 8, fiber: 8, benefits: "Protein, calcium, and fruit in one bowl.", drawbacks: "Sweetened versions can add extra sugar.", healthPoints: 8, diseasePoints: 0, cholesterolCategory: "Low" },
  { id: "salmon-bowl", name: "Salmon harvest bowl", description: "Roasted salmon with grains, greens, cucumber, and herbs.", type: "Lunch", origin: "Coastal", calories: 540, protein: 36, carbs: 56, fats: 18, fiber: 7, benefits: "A source of protein and unsaturated fats.", drawbacks: "Portion and dressing can change the nutrition substantially.", healthPoints: 9, diseasePoints: 0, cholesterolCategory: "Moderate" },
  { id: "apple-almond", name: "Apple & almond butter", description: "Crisp apple with a spoon of almond butter.", type: "Snack", origin: "Everyday", calories: 210, protein: 6, carbs: 24, fats: 12, fiber: 5, benefits: "Fruit and a satisfying source of fats.", drawbacks: "Nut butter portions are easy to underestimate.", healthPoints: 7, diseasePoints: 0, cholesterolCategory: "Low" },
  { id: "lentil-soup", name: "Lentil & tomato soup", description: "Slow-simmered lentils, tomato, greens, and warm spices.", type: "Lunch", origin: "Levantine-inspired", calories: 410, protein: 23, carbs: 62, fats: 7, fiber: 16, benefits: "Lentils contribute protein and fiber.", drawbacks: "Packaged versions may contain more sodium.", healthPoints: 9, diseasePoints: 0, cholesterolCategory: "Low" },
  { id: "tofu-stir-fry", name: "Ginger tofu stir-fry", description: "Crisp tofu, brown rice, broccoli, ginger, and sesame.", type: "Dinner", origin: "East Asian-inspired", calories: 490, protein: 25, carbs: 61, fats: 15, fiber: 9, benefits: "Plant protein with colorful vegetables.", drawbacks: "Sauces vary in sodium and added sugar.", healthPoints: 8, diseasePoints: 0, cholesterolCategory: "Low" },
  { id: "egg-toast", name: "Egg & avocado toast", description: "Poached eggs, avocado, and seeded toast.", type: "Breakfast", origin: "Everyday", calories: 420, protein: 21, carbs: 38, fats: 22, fiber: 9, benefits: "A filling mix of protein, fiber, and fats.", drawbacks: "Bread and toppings vary by brand and serving.", healthPoints: 8, diseasePoints: 0, cholesterolCategory: "Moderate" },
  { id: "chickpea-salad", name: "Herby chickpea salad", description: "Chickpeas, cucumber, tomato, parsley, lemon, and olive oil.", type: "Lunch", origin: "Mediterranean-inspired", calories: 460, protein: 18, carbs: 58, fats: 18, fiber: 14, benefits: "Legumes and vegetables add fiber and variety.", drawbacks: "Oil amount is a meaningful part of the estimate.", healthPoints: 9, diseasePoints: 0, cholesterolCategory: "Low" },
  { id: "banana-smoothie", name: "Banana oat smoothie", description: "Banana, oats, milk, and a little cinnamon.", type: "Snack", origin: "Everyday", calories: 310, protein: 13, carbs: 52, fats: 7, fiber: 7, benefits: "An easy-to-adjust snack with fruit and grains.", drawbacks: "Liquid meals may be less filling for some people.", healthPoints: 7, diseasePoints: 0, cholesterolCategory: "Low" }
];

const planSeed: Omit<PlanMeal, "id">[] = [
  { day: "Mon", meal: "Breakfast", name: "Greek yogurt, berries & oats", calories: 380, protein: 28, status: "planned" },
  { day: "Mon", meal: "Lunch", name: "Salmon harvest bowl", calories: 540, protein: 36, status: "planned" },
  { day: "Mon", meal: "Dinner", name: "Lentil & tomato soup", calories: 410, protein: 23, status: "planned" },
  { day: "Tue", meal: "Breakfast", name: "Egg & avocado toast", calories: 420, protein: 21, status: "planned" },
  { day: "Tue", meal: "Lunch", name: "Herby chickpea salad", calories: 460, protein: 18, status: "planned" },
  { day: "Tue", meal: "Dinner", name: "Ginger tofu stir-fry", calories: 490, protein: 25, status: "planned" },
  { day: "Wed", meal: "Breakfast", name: "Banana oat smoothie", calories: 310, protein: 13, status: "planned" },
  { day: "Wed", meal: "Lunch", name: "Lentil & tomato soup", calories: 410, protein: 23, status: "planned" },
  { day: "Wed", meal: "Dinner", name: "Salmon harvest bowl", calories: 540, protein: 36, status: "planned" },
  { day: "Thu", meal: "Breakfast", name: "Greek yogurt, berries & oats", calories: 380, protein: 28, status: "planned" },
  { day: "Thu", meal: "Lunch", name: "Herby chickpea salad", calories: 460, protein: 18, status: "planned" },
  { day: "Thu", meal: "Dinner", name: "Ginger tofu stir-fry", calories: 490, protein: 25, status: "planned" },
  { day: "Fri", meal: "Breakfast", name: "Egg & avocado toast", calories: 420, protein: 21, status: "planned" },
  { day: "Fri", meal: "Lunch", name: "Salmon harvest bowl", calories: 540, protein: 36, status: "planned" },
  { day: "Fri", meal: "Dinner", name: "Lentil & tomato soup", calories: 410, protein: 23, status: "planned" },
  { day: "Sat", meal: "Breakfast", name: "Banana oat smoothie", calories: 310, protein: 13, status: "planned" },
  { day: "Sat", meal: "Lunch", name: "Ginger tofu stir-fry", calories: 490, protein: 25, status: "planned" },
  { day: "Sat", meal: "Dinner", name: "Herby chickpea salad", calories: 460, protein: 18, status: "planned" },
  { day: "Sun", meal: "Breakfast", name: "Greek yogurt, berries & oats", calories: 380, protein: 28, status: "planned" },
  { day: "Sun", meal: "Lunch", name: "Lentil & tomato soup", calories: 410, protein: 23, status: "planned" },
  { day: "Sun", meal: "Dinner", name: "Salmon harvest bowl", calories: 540, protein: 36, status: "planned" }
];

export function createPlanSeed(now = new Date()): PlanMeal[] {
  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const seedDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return planSeed.map((meal, index) => {
    const offset = seedDays.indexOf(meal.day);
    return { ...meal, day: weekdays[(now.getDay() + offset) % 7], id: `plan-${index + 1}` };
  });
}

export function createInitialState(now = new Date()): LocalState {
  const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const at = (hours: number, minutes: number) => {
    const date = new Date(now);
    date.setHours(hours, minutes, 0, 0);
    return date.toISOString();
  };
  const today = dateKey(now);
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  return {
    meals: [
      { id: "seed-breakfast", name: "Greek yogurt, berries & oats", category: "Breakfast", calories: 380, protein: 28, carbs: 48, fats: 8, fiber: 8, micros: ["Calcium", "Vitamin C", "Fiber"], ingredients: ["Greek yogurt", "Blueberries", "Rolled oats", "Chia"], healthScore: 86, healthPoints: 8, diseasePoints: 0, source: "Manual", createdAt: at(8, 10) },
      { id: "seed-lunch", name: "Salmon harvest bowl", category: "Lunch", calories: 540, protein: 36, carbs: 56, fats: 18, fiber: 7, micros: ["Omega-3", "Vitamin D", "Potassium"], ingredients: ["Salmon", "Quinoa", "Greens", "Cucumber"], healthScore: 89, healthPoints: 9, diseasePoints: 0, source: "Photo", createdAt: at(12, 35) },
      { id: "seed-snack", name: "Apple & almond butter", category: "Snack", calories: 210, protein: 6, carbs: 24, fats: 12, fiber: 5, micros: ["Fiber", "Vitamin E"], ingredients: ["Apple", "Almond butter"], healthScore: 78, healthPoints: 7, diseasePoints: 0, source: "Manual", createdAt: at(15, 5) }
    ],
    hydrationMl: 1350,
    waterGoalMl: 2500,
    hydrationStreak: 4,
    hydrationStreakDate: dateKey(yesterday),
    calorieGoal: 2000,
    macroGoals: { protein: 120, carbs: 220, fats: 70 },
    workouts: [
      { id: "seed-workout-1", title: "Easy morning walk", durationMinutes: 28, caloriesBurned: 112, scheduledDate: today, completed: true },
      { id: "seed-workout-2", title: "Mobility & stretch", durationMinutes: 15, caloriesBurned: 42, scheduledDate: today, completed: false }
    ],
    goal: "Feel more balanced",
    planMeals: createPlanSeed(now)
  };
}
