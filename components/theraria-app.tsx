"use client";

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import {
  Activity, Apple, ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, CalendarDays,
  Check, ChefHat, ChevronDown, ChevronRight, CircleHelp, Clock3, Copy, Droplets,
  Flame, Footprints, HeartPulse, Home, Info, Leaf, Menu, Mic, Moon, Plus, Search,
  Settings2, Share2, ShoppingBasket, Sparkles, Utensils, X, Camera, Dumbbell,
  type LucideIcon,
} from "lucide-react";
import { createInitialState, FOOD_CATALOG } from "@/lib/seed-data";
import { dayKey, estimateFood, scoreMeal, totalsFor } from "@/lib/demo-logic";
import { loadLocalState, saveLocalState } from "@/lib/local-store";
import type { LocalState, Meal, MealSource, PlanMeal, Section } from "@/lib/types";

const NAV_ITEMS: { id: Section; label: string; icon: LucideIcon; group: string }[] = [
  { id: "overview", label: "Overview", icon: Home, group: "YOUR DAY" },
  { id: "meals", label: "Food journal", icon: Utensils, group: "YOUR DAY" },
  { id: "plans", label: "Meal plans", icon: CalendarDays, group: "YOUR DAY" },
  { id: "activity", label: "Movement", icon: Dumbbell, group: "YOUR DAY" },
  { id: "foods", label: "Food library", icon: Apple, group: "EXPLORE" },
  { id: "coach", label: "Gentle coach", icon: Sparkles, group: "EXPLORE" },
  { id: "share", label: "Progress card", icon: Share2, group: "EXPLORE" },
];

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

const SWAP_OPTIONS = [
  { name: "Roasted veggie & quinoa bowl", calories: 455, protein: 19 },
  { name: "Lemon tofu grain bowl", calories: 470, protein: 24 },
  { name: "Herby chickpea plate", calories: 430, protein: 18 },
];

const RECIPE_CARDS = [
  { name: "Lemony lentil & greens bowl", time: "25 min", tag: "High-fiber", ingredients: ["Green lentils", "Baby spinach", "Lemon", "Garlic", "Olive oil"] },
  { name: "Crispy tofu rice plate", time: "30 min", tag: "Plant-forward", ingredients: ["Firm tofu", "Brown rice", "Broccoli", "Ginger", "Sesame"] },
  { name: "Berry oat breakfast jar", time: "10 min", tag: "Make ahead", ingredients: ["Rolled oats", "Greek yogurt", "Blueberries", "Chia", "Cinnamon"] },
];

type EntryMode = MealSource;
type Period = "Today" | "7 days" | "30 days";

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

function percent(value: number, target: number) {
  return Math.min(100, Math.max(0, target > 0 ? Math.round((value / target) * 100) : 0));
}

function prettyTime(value: string) {
  return new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(new Date(value));
}

function titleFor(section: Section) {
  return NAV_ITEMS.find((item) => item.id === section)?.label ?? "Overview";
}

function scoreFromMeals(meals: Meal[]) {
  if (!meals.length) return 82;
  return Math.round(meals.reduce((total, meal) => total + meal.healthScore, 0) / meals.length);
}

function caloriesForDay(plan: PlanMeal[], day: string) {
  return plan.filter((meal) => meal.day === day && meal.status !== "skipped").reduce((total, meal) => total + meal.calories, 0);
}

function planIngredients(name: string): { category: string; items: string[] }[] {
  const lower = name.toLowerCase();
  if (lower.includes("salmon")) return [{ category: "Produce", items: ["Mixed greens", "Cucumber", "Lemon"] }, { category: "Proteins", items: ["Salmon"] }, { category: "Pantry", items: ["Quinoa", "Olive oil"] }];
  if (lower.includes("lentil")) return [{ category: "Produce", items: ["Tomatoes", "Spinach", "Onion"] }, { category: "Proteins", items: ["Green lentils"] }, { category: "Pantry", items: ["Vegetable stock", "Cumin"] }];
  if (lower.includes("tofu")) return [{ category: "Produce", items: ["Broccoli", "Ginger", "Scallions"] }, { category: "Proteins", items: ["Firm tofu"] }, { category: "Pantry", items: ["Brown rice", "Sesame"] }];
  if (lower.includes("chickpea")) return [{ category: "Produce", items: ["Cucumber", "Tomatoes", "Parsley", "Lemon"] }, { category: "Proteins", items: ["Chickpeas"] }, { category: "Pantry", items: ["Olive oil"] }];
  if (lower.includes("egg")) return [{ category: "Produce", items: ["Avocado"] }, { category: "Proteins", items: ["Eggs"] }, { category: "Pantry", items: ["Seeded bread"] }];
  if (lower.includes("yogurt")) return [{ category: "Produce", items: ["Blueberries"] }, { category: "Dairy", items: ["Greek yogurt"] }, { category: "Pantry", items: ["Rolled oats", "Chia seeds"] }];
  return [{ category: "Produce", items: ["Banana"] }, { category: "Dairy", items: ["Milk"] }, { category: "Pantry", items: ["Rolled oats", "Cinnamon"] }];
}

function AppLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-lockup${compact ? " brand-lockup-compact" : ""}`}>
      <img src="/theraria-logo.png" width="38" height="38" alt="" className="brand-mark" />
      {!compact && <div><span className="brand-name">theraria</span><span className="brand-caption">NUTRISYNC AI</span></div>}
    </div>
  );
}

function DemoTag({ children = "DEMO · NOT CONNECTED" }: { children?: React.ReactNode }) {
  return <span className="demo-tag"><span className="status-dot" />{children}</span>;
}

function SectionHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</div>;
}

function ProgressBar({ value, color = "green" }: { value: number; color?: "green" | "amber" | "clay" }) {
  return <div className={`progress-track progress-${color}`}><span style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div>;
}

function MacroRow({ label, value, goal, tint }: { label: string; value: number; goal: number; tint?: string }) {
  return <div className="macro-row"><div className="macro-label"><span className={`macro-dot ${tint ?? ""}`} /><span>{label}</span><strong>{value}g <small>/ {goal}g</small></strong></div><ProgressBar value={percent(value, goal)} /></div>;
}

function MetricTile({ icon: Icon, value, unit, label, tone }: { icon: LucideIcon; value: string; unit?: string; label: string; tone: string }) {
  return <div className="metric-tile"><span className={`metric-icon ${tone}`}><Icon size={17} /></span><div><strong>{value}<small>{unit}</small></strong><span>{label}</span></div></div>;
}

export function TherariaApp() {
  const [data, setData] = useState<LocalState>(() => createInitialState());
  const [active, setActive] = useState<Section>("overview");
  const [hydrated, setHydrated] = useState(false);
  const [todayLabel, setTodayLabel] = useState("Your daily overview");
  const [toast, setToast] = useState("");
  const [period, setPeriod] = useState<Period>("Today");
  const [entryMode, setEntryMode] = useState<EntryMode>("Manual");
  const [mealName, setMealName] = useState("");
  const [voiceText, setVoiceText] = useState("");
  const [mealCategory, setMealCategory] = useState("Lunch");
  const [portion, setPortion] = useState(1);
  const [extraOil, setExtraOil] = useState(false);
  const [ingredientNotes, setIngredientNotes] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState("");
  const [foodSearch, setFoodSearch] = useState("");
  const [foodType, setFoodType] = useState("All foods");
  const [workoutName, setWorkoutName] = useState("");
  const [workoutMinutes, setWorkoutMinutes] = useState(30);
  const [askText, setAskText] = useState("");
  const [recipeIndex, setRecipeIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setData(loadLocalState(createInitialState()));
    setTodayLabel(new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date()));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveLocalState(data);
  }, [data, hydrated]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  useEffect(() => () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
  }, [photoPreview]);

  const todayKey = dayKey(new Date().toISOString());
  const planDays = Array.from({ length: 7 }, (_, offset) => WEEKDAYS[(new Date().getDay() + offset) % 7]);
  const todayPlanDay = planDays[0];
  const todayMeals = useMemo(() => data.meals.filter((meal) => dayKey(meal.createdAt) === todayKey), [data.meals, todayKey]);
  const dailyTotals = useMemo(() => totalsFor(todayMeals), [todayMeals]);
  const dayScore = scoreFromMeals(todayMeals);
  const mealInput = entryMode === "Voice" ? voiceText : mealName;
  const liveEstimate = estimateFood(mealInput, portion, extraOil);

  function flash(message: string) {
    setToast(message);
  }

  function go(section: Section) {
    setActive(section);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function onAddMeal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = (entryMode === "Voice" ? voiceText : mealName).trim() || (entryMode === "Photo" && photoName ? `${photoName.replace(/\.[^.]+$/, "")} · sample scan` : "");
    if (!name) {
      flash(entryMode === "Photo" ? "Choose a photo or enter a food name first." : "Add a food name before saving.");
      return;
    }
    const estimate = estimateFood(name, portion, extraOil);
    const score = scoreMeal(estimate);
    const manualIngredients = ingredientNotes.split(",").map((item) => item.trim()).filter(Boolean);
    const newMeal: Meal = {
      id: globalThis.crypto?.randomUUID?.() ?? `meal-${Date.now()}`,
      name,
      category: mealCategory,
      calories: estimate.calories,
      protein: estimate.protein,
      carbs: estimate.carbs,
      fats: estimate.fats,
      fiber: estimate.fiber,
      micros: estimate.micros,
      ingredients: [...estimate.ingredients, ...manualIngredients],
      healthScore: score,
      healthPoints: Math.max(0, score - 70),
      diseasePoints: 0,
      source: entryMode,
      createdAt: new Date().toISOString(),
    };
    setData((previous) => ({ ...previous, meals: [newMeal, ...previous.meals] }));
    setMealName("");
    setVoiceText("");
    setIngredientNotes("");
    setExtraOil(false);
    setPhotoName("");
    setPhotoPreview(null);
    flash("Saved on this browser. Demo nutrition only—not a medical estimate.");
  }

  function onPhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoName(file.name);
    setPhotoPreview(URL.createObjectURL(file));
    flash("Photo preview stays in this tab; no image is uploaded or saved.");
  }

  function addWater(amount: number) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = dayKey(yesterday.toISOString());
    const willCompleteGoal = Math.min(data.waterGoalMl, data.hydrationMl + amount) >= data.waterGoalMl && data.hydrationStreakDate !== todayKey;
    const nextStreak = data.hydrationStreakDate === yesterdayKey ? data.hydrationStreak + 1 : 1;
    setData((previous) => {
      const hydrationMl = Math.min(previous.waterGoalMl, previous.hydrationMl + amount);
      const reachedGoal = hydrationMl >= previous.waterGoalMl && previous.hydrationStreakDate !== todayKey;
      return {
        ...previous,
        hydrationMl,
        hydrationStreak: reachedGoal ? (previous.hydrationStreakDate === yesterdayKey ? previous.hydrationStreak + 1 : 1) : previous.hydrationStreak,
        hydrationStreakDate: reachedGoal ? todayKey : previous.hydrationStreakDate,
      };
    });
    flash(willCompleteGoal ? `Daily goal reached. Your ${nextStreak}-day demo streak is saved in this browser.` : `Added ${amount} ml to your local demo log.`);
  }

  function addWorkout(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!workoutName.trim()) {
      flash("Give your activity a name first.");
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const next = { id: `workout-${Date.now()}`, title: workoutName.trim(), durationMinutes: Math.max(1, workoutMinutes), caloriesBurned: Math.round(workoutMinutes * 4), scheduledDate: today, completed: false };
    setData((previous) => ({ ...previous, workouts: [next, ...previous.workouts] }));
    setWorkoutName("");
    flash("Activity added to this browser.");
  }

  function toggleWorkout(id: string) {
    setData((previous) => ({ ...previous, workouts: previous.workouts.map((workout) => workout.id === id ? { ...workout, completed: !workout.completed } : workout) }));
  }

  function swapPlanMeal(meal: PlanMeal) {
    const currentIndex = SWAP_OPTIONS.findIndex((option) => option.name === meal.name);
    const option = SWAP_OPTIONS[(currentIndex + 1 + SWAP_OPTIONS.length) % SWAP_OPTIONS.length];
    setData((previous) => ({ ...previous, planMeals: previous.planMeals.map((item) => item.id === meal.id ? { ...item, name: option.name, calories: option.calories, protein: option.protein, status: "planned" } : item) }));
    flash("Plan updated and sample totals recalculated.");
  }

  function toggleSkipped(meal: PlanMeal) {
    setData((previous) => ({ ...previous, planMeals: previous.planMeals.map((item) => item.id === meal.id ? { ...item, status: item.status === "skipped" ? "planned" : "skipped" } : item) }));
    flash(meal.status === "skipped" ? "Meal restored to the plan." : "Meal skipped; sample totals recalculated.");
  }

  async function shareSummary() {
    const summary = `My Theraria demo day: ${formatNumber(dailyTotals.calories)} calories logged, ${dayScore}/100 sample score, ${formatNumber(data.hydrationMl)} ml water. Demo values only.`;
    try {
      if (navigator.share) await navigator.share({ title: "My Theraria progress", text: summary });
      else if (navigator.clipboard) await navigator.clipboard.writeText(summary);
      else throw new Error("Sharing is not available in this browser.");
      setCopied(true);
      flash("Progress summary shared or copied.");
    } catch {
      flash("Sharing was canceled or is unavailable in this browser.");
    }
  }

  const filteredByPeriod = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    if (period === "7 days") start.setDate(now.getDate() - 6);
    if (period === "30 days") start.setDate(now.getDate() - 29);
    start.setHours(0, 0, 0, 0);
    return data.meals.filter((meal) => period === "Today" ? dayKey(meal.createdAt) === todayKey : new Date(meal.createdAt) >= start);
  }, [data.meals, period, todayKey]);
  const periodTotals = totalsFor(filteredByPeriod);
  const filteredFoods = FOOD_CATALOG.filter((food) => {
    const matchesText = `${food.name} ${food.description} ${food.type} ${food.origin}`.toLowerCase().includes(foodSearch.toLowerCase());
    return matchesText && (foodType === "All foods" || food.type === foodType);
  });
  const planForToday = data.planMeals.filter((meal) => meal.day === todayPlanDay && meal.status !== "skipped");
  const groceryGroups = useMemo(() => {
    const groups: Record<string, Set<string>> = { Produce: new Set(), Proteins: new Set(), Pantry: new Set(), Dairy: new Set() };
    data.planMeals.filter((meal) => meal.status !== "skipped").forEach((meal) => {
      planIngredients(meal.name).forEach(({ category, items }) => items.forEach((item) => groups[category]?.add(item)));
    });
    return groups;
  }, [data.planMeals]);

  function renderOverview() {
    const completed = data.workouts.filter((workout) => workout.completed).length;
    const waterPct = percent(data.hydrationMl, data.waterGoalMl);
    const caloriePct = percent(dailyTotals.calories, data.calorieGoal);
    return (
      <>
        <div className="welcome-line"><div><span className="eyebrow">{todayLabel.toUpperCase()}</span><h1>A little more in balance.</h1><p>Notice the patterns, celebrate the small things.</p></div><DemoTag /></div>
        <section className="hero-panel">
          <div className="hero-copy"><span className="eyebrow light-eyebrow">TODAY, AT A GLANCE</span><h2>Your day is<br /><em>taking shape.</em></h2><p>A friendly snapshot built from sample entries. Add what you eat or move through to see your day change.</p><div className="hero-actions"><button className="button button-cream" onClick={() => go("meals")}><Plus size={16} /> Log a meal</button><button className="button button-quiet-light" onClick={() => go("activity")}><Activity size={16} /> Add movement</button></div><span className="hero-footnote"><Info size={13} /> AI and wearable data are not connected</span></div>
          <div className="hero-image-wrap"><img className="hero-image" src="/manus-storage/async-images/9Fcbxu1lzcJcruL69FOedm/image-2.webp" alt="Sample grain bowl with greens, grains, and citrus" /><div className="image-caption"><span>ON THE TABLE</span><strong>Colorful, simple, satisfying</strong></div><div className="image-spot"><Leaf size={17} /></div></div>
        </section>
        <div className="summary-grid">
          <article className="card score-card"><div className="card-topline"><div><span className="eyebrow">DAILY HEALTH SCORE</span><h3>Your rhythm</h3></div><span className="card-icon icon-mint"><Sparkles size={18} /></span></div><div className="score-row"><div className="score-ring" style={{ "--score": `${dayScore}%` } as React.CSSProperties}><div><strong>{dayScore}</strong><small>/100</small></div></div><div className="score-copy"><strong>Steady start</strong><span>Sample-only reflection</span><small>Not a clinical or validated score.</small></div></div><div className="card-divider" /><div className="score-footer"><span>Based on {todayMeals.length} logged meals</span><button className="text-button" onClick={() => go("coach")}>See note <ArrowRight size={14} /></button></div></article>
          <article className="card calorie-card"><div className="card-topline"><div><span className="eyebrow">ENERGY IN</span><h3>Calorie balance</h3></div><span className="card-icon icon-sand"><Flame size={18} /></span></div><div className="big-metric"><strong>{formatNumber(dailyTotals.calories)}</strong><span> / {formatNumber(data.calorieGoal)} kcal</span></div><ProgressBar value={caloriePct} color="amber" /><div className="calorie-meta"><span>{Math.max(0, data.calorieGoal - dailyTotals.calories)} kcal to demo goal</span><span>{caloriePct}%</span></div><button className="text-button card-action" onClick={() => go("meals")}>Adjust your targets <ArrowRight size={14} /></button></article>
          <article className="card water-card"><div className="card-topline"><div><span className="eyebrow">HYDRATION</span><h3>A sip at a time</h3></div><span className="card-icon icon-blue"><Droplets size={18} /></span></div><div className="big-metric"><strong>{formatNumber(data.hydrationMl)}</strong><span> / {formatNumber(data.waterGoalMl)} ml</span></div><ProgressBar value={waterPct} color="green" /><div className="water-quick-actions"><button onClick={() => addWater(150)}>+150 ml</button><button onClick={() => addWater(250)}>+250 ml</button><button onClick={() => addWater(500)}><Plus size={13} /> 500</button></div><span className="streak-label"><Flame size={14} /> {data.hydrationStreak}-day demo streak</span></article>
        </div>
        <div className="content-grid content-grid-main">
          <article className="card nutrition-card"><div className="card-topline"><div><span className="eyebrow">NUTRIENTS</span><h3>Make room for what fuels you</h3></div><button className="icon-button" aria-label="Nutrition details" onClick={() => go("meals")}><ArrowUpRight size={17} /></button></div><div className="macro-summary"><MacroRow label="Protein" value={dailyTotals.protein} goal={data.macroGoals.protein} tint="dot-green" /><MacroRow label="Carbohydrates" value={dailyTotals.carbs} goal={data.macroGoals.carbs} tint="dot-gold" /><MacroRow label="Fat" value={dailyTotals.fats} goal={data.macroGoals.fats} tint="dot-clay" /></div><div className="nutrient-note"><span className="note-icon"><Leaf size={16} /></span><p><strong>A gentle nudge</strong><br />{dailyTotals.protein < data.macroGoals.protein * 0.65 ? "Consider a protein-rich option with your next meal. This sample suggestion is not personalized medical advice." : "A balanced mix is taking shape. Keep your next choice simple and satisfying."}</p></div></article>
          <article className="card activity-card"><div className="card-topline"><div><span className="eyebrow">MOVEMENT & REST</span><h3>How your body is doing</h3></div><span className="connected-label"><span className="status-dot" /> SAMPLE DATA</span></div><div className="metric-grid"><MetricTile icon={Footprints} value="6,420" label="Steps" tone="icon-mint" /><MetricTile icon={Flame} value="318" unit=" kcal" label="Active energy" tone="icon-sand" /><MetricTile icon={HeartPulse} value="62" unit=" bpm" label="Resting heart rate" tone="icon-rose" /><MetricTile icon={Moon} value="7.4" unit=" hrs" label="Sleep" tone="icon-blue" /></div><div className="activity-footer"><span><Clock3 size={14} /> {completed} of {data.workouts.length} activities completed</span><button className="text-button" onClick={() => go("activity")}>View movement <ArrowRight size={14} /></button></div></article>
        </div>
        <div className="content-grid content-grid-bottom"><article className="card recent-card"><div className="card-topline"><div><span className="eyebrow">FOOD JOURNAL</span><h3>On your plate today</h3></div><button className="text-button" onClick={() => go("meals")}>All entries <ArrowRight size={14} /></button></div>{todayMeals.length ? <div className="meal-list">{todayMeals.slice(0, 3).map((meal) => <MealRow key={meal.id} meal={meal} />)}</div> : <EmptyState icon={Utensils} text="No meals logged yet. Start with one small entry." onClick={() => go("meals")} action="Log first meal" />}<div className="journal-note"><Info size={14} /> Demo values are illustrative and may not match a real meal.</div></article><article className="card week-card"><div className="card-topline"><div><span className="eyebrow">THIS WEEK</span><h3>Your weekly rhythm</h3></div><span className="card-icon icon-mint"><CalendarDays size={18} /></span></div><div className="week-bars" aria-label="Sample weekly activity chart">{[42, 68, 54, 82, 58, 73, 48].map((height, index) => <div className="week-bar-col" key={index}><div className="week-bar-track"><span style={{ height: `${height}%` }} /></div><small>{["M", "T", "W", "T", "F", "S", "S"][index]}</small></div>)}</div><div className="week-footer"><span><strong>{formatNumber(1460)}</strong> kcal/day avg. <small>· sample</small></span><button className="text-button" onClick={() => go("plans")}>View plan <ArrowRight size={14} /></button></div></article></div>
        <MedicalNote />
      </>
    );
  }

  function renderMeals() {
    const sortedMeals = [...filteredByPeriod].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return (
      <>
        <SectionHeading eyebrow="FOOD JOURNAL" title="Meals, made visible." description="Log a meal by typing, choosing a photo for a local-only preview, or editing a sample voice transcript." action={<DemoTag>GEMINI NOT CONNECTED</DemoTag>} />
        <div className="notice notice-amber"><Info size={17} /><p><strong>Demo estimates only.</strong> Nutrition values use a tiny sample catalog and a simple heuristic. They are not medical, allergy, cholesterol, diabetes, or dietary guidance.</p></div>
        <div className="content-grid meals-layout"><article className="card form-card"><div className="card-topline"><div><span className="eyebrow">ADD AN ENTRY</span><h3>What did you enjoy?</h3></div><span className="card-icon icon-mint"><Plus size={18} /></span></div><div className="mode-switch" role="tablist" aria-label="Meal entry method">{(["Manual", "Photo", "Voice"] as EntryMode[]).map((mode) => <button key={mode} className={entryMode === mode ? "mode-active" : ""} onClick={() => setEntryMode(mode)} role="tab" aria-selected={entryMode === mode}>{mode === "Manual" ? <Utensils size={15} /> : mode === "Photo" ? <Camera size={15} /> : <Mic size={15} />}{mode}</button>)}</div>
          <form className="meal-form" onSubmit={onAddMeal}>{entryMode === "Photo" && <div className="photo-drop"><label className="upload-label"><Camera size={19} /><span><strong>Choose a meal photo</strong><small>Temporary preview only · not uploaded or stored</small></span><input type="file" accept="image/*" onChange={onPhotoChange} /></label>{photoPreview && <div className="photo-preview"><img src={photoPreview} alt="Temporary meal preview" /><span>{photoName}</span><button type="button" className="icon-button" aria-label="Remove photo preview" onClick={() => { setPhotoPreview(null); setPhotoName(""); }}><X size={16} /></button></div>}</div>}
            {entryMode === "Voice" ? <div className="field-block"><label htmlFor="voice-transcript">Dictation transcript</label><textarea id="voice-transcript" rows={3} placeholder="Type what you ate, or load a sample transcript…" value={voiceText} onChange={(event) => setVoiceText(event.target.value)} /><button className="text-button sample-transcript" type="button" onClick={() => setVoiceText("A bowl of Greek yogurt with berries and oats")}>Try sample transcript <ArrowRight size={13} /></button><small className="field-hint">Microphone recording and Gemini parsing are not connected in this demo.</small></div> : <div className="field-block"><label htmlFor="meal-name">Food or meal</label><input id="meal-name" value={mealName} onChange={(event) => setMealName(event.target.value)} placeholder="e.g. chickpea salad with lemon" />{entryMode === "Photo" && <small className="field-hint">Photo selection does not run image analysis. Enter a meal name for a sample estimate.</small>}</div>}
            <div className="form-grid"><div className="field-block"><label htmlFor="meal-category">Meal time</label><select id="meal-category" value={mealCategory} onChange={(event) => setMealCategory(event.target.value)}><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option></select></div><div className="field-block"><label htmlFor="portion">Portions</label><input id="portion" type="number" min="0.25" max="5" step="0.25" value={portion} onChange={(event) => setPortion(Math.max(0.25, Number(event.target.value) || 1))} /></div></div>
            <div className="field-block"><label htmlFor="ingredients">Add or correct ingredients</label><input id="ingredients" value={ingredientNotes} onChange={(event) => setIngredientNotes(event.target.value)} placeholder="e.g. dressing, butter, tahini" /><small className="field-hint">Comma-separated notes are added to this local entry.</small></div>
            <label className="checkbox-line"><input type="checkbox" checked={extraOil} onChange={(event) => setExtraOil(event.target.checked)} /><span><strong>Include hidden oil, butter, or sauce</strong><small>adds a +120 kcal / +14 g fat sample adjustment</small></span></label>
            <div className="estimate-preview"><div><span className="eyebrow">SAMPLE ESTIMATE</span><strong>{formatNumber(liveEstimate.calories)} <small>kcal</small></strong></div><div><span>{liveEstimate.protein}g protein · {liveEstimate.carbs}g carbs · {liveEstimate.fats}g fat</span><small>Illustrative only; actual portions vary.</small></div></div>
            <button className="button button-primary button-wide" type="submit"><Plus size={16} /> Save to this browser</button>
          </form>
        </article>
        <div className="stacked-content"><article className="card macro-goals-card"><div className="card-topline"><div><span className="eyebrow">YOUR TARGETS</span><h3>Macro guide</h3></div><Settings2 size={18} className="muted-icon" /></div><p className="card-subtext">Change demo targets to explore the journal. No personal profile is stored online.</p><div className="target-inputs">{(["protein", "carbs", "fats"] as const).map((key) => <label key={key}><span>{key === "carbs" ? "Carbs" : key[0].toUpperCase() + key.slice(1)} <small>g/day</small></span><input type="number" min="1" value={data.macroGoals[key]} onChange={(event) => setData((previous) => ({ ...previous, macroGoals: { ...previous.macroGoals, [key]: Math.max(1, Number(event.target.value) || 1) } }))} /></label>)}</div><label className="target-calorie"><span>Calorie goal <small>kcal/day</small></span><input type="number" min="500" step="50" value={data.calorieGoal} onChange={(event) => setData((previous) => ({ ...previous, calorieGoal: Math.max(500, Number(event.target.value) || 500) }))} /></label><p className="target-disclaimer">Targets are sample controls—not a personalized prescription.</p></article>
          <article className="card score-method-card"><div className="card-topline"><div><span className="eyebrow">TRANSPARENCY</span><h3>About these numbers</h3></div><CircleHelp size={18} className="muted-icon" /></div><p className="card-subtext">A local, simple formula looks at protein, fiber, and fat to make a demonstration score. It is not validated for health outcomes.</p><div className="point-pills"><span>Health points · demo</span><span>Disease points · not assessed</span><span>Cholesterol · not assessed</span></div></article></div></div>
        <article className="card journal-card"><div className="card-topline journal-head"><div><span className="eyebrow">YOUR FOOD JOURNAL</span><h3>Entries & nutrient totals</h3></div><div className="segmented-control">{(["Today", "7 days", "30 days"] as Period[]).map((item) => <button key={item} className={period === item ? "selected" : ""} onClick={() => setPeriod(item)}>{item}</button>)}</div></div><div className="journal-totals"><MetricTile icon={Flame} value={formatNumber(periodTotals.calories)} unit=" kcal" label={`${period.toLowerCase()} energy`} tone="icon-sand" /><MetricTile icon={HeartPulse} value={formatNumber(periodTotals.protein)} unit=" g" label="Protein" tone="icon-mint" /><MetricTile icon={Leaf} value={formatNumber(periodTotals.fiber)} unit=" g" label="Fiber" tone="icon-blue" /></div>{sortedMeals.length ? <div className="meal-list meal-list-full">{sortedMeals.map((meal) => <MealRow key={meal.id} meal={meal} onDelete={() => { setData((previous) => ({ ...previous, meals: previous.meals.filter((item) => item.id !== meal.id) })); flash("Entry removed from this browser."); }} />)}</div> : <EmptyState icon={Utensils} text={`No meals logged in ${period.toLowerCase()} yet.`} onClick={() => go("meals")} action="Add an entry" />}</article>
        <MedicalNote />
      </>
    );
  }

  function renderPlans() {
    const activePlanMeals = data.planMeals.filter((meal) => meal.status !== "skipped");
    const totalWeek = activePlanMeals.reduce((total, meal) => total + meal.calories, 0);
    const chosenRecipe = RECIPE_CARDS[recipeIndex];
    return (
      <>
        <SectionHeading eyebrow="MEAL PLANNER" title="A week with a little structure." description="Explore a sample plan, swap meals, and watch the demonstration totals update." action={<DemoTag>AI PLANNER NOT CONNECTED</DemoTag>} />
        <div className="notice notice-green"><Sparkles size={17} /><p><strong>Preview mode.</strong> This is seeded example content, not generated by Gemini or tailored to a medical condition.</p></div>
        <article className="card plan-toolbar"><div><span className="eyebrow">YOUR INTENTION</span><h3>What would you like to focus on?</h3></div><select value={data.goal} onChange={(event) => setData((previous) => ({ ...previous, goal: event.target.value }))}><option>Feel more balanced</option><option>Fat loss (sample)</option><option>Muscle gain (sample)</option><option>Keto-inspired (sample)</option><option>Plant-forward (sample)</option></select></article>
        <div className="plan-stats"><article className="card plan-stat-card"><span className="eyebrow">7-DAY SAMPLE TOTAL</span><strong>{formatNumber(totalWeek)} <small>kcal</small></strong><span>Across {activePlanMeals.length} planned meals · example only</span></article><article className="card plan-stat-card"><span className="eyebrow">TODAY'S PLAN</span><strong>{formatNumber(caloriesForDay(data.planMeals, todayPlanDay))} <small>kcal</small></strong><span>{planForToday.length} meals currently planned</span></article><article className="card plan-stat-card"><span className="eyebrow">DAILY TARGET</span><strong>{formatNumber(data.calorieGoal)} <small>kcal</small></strong><span>Editable in your food journal</span></article></div>
        <div className="week-plan-grid">{planDays.map((day, index) => { const dayMeals = data.planMeals.filter((meal) => meal.day === day); return <article className={`card day-card ${index === 0 ? "day-card-today" : ""}`} key={day}><div className="day-heading"><span>{day}</span>{index === 0 && <small>TODAY</small>}<strong>{formatNumber(caloriesForDay(data.planMeals, day))}<small> kcal</small></strong></div><div className="day-meal-list">{dayMeals.map((meal) => <div className={`plan-meal ${meal.status === "skipped" ? "plan-meal-skipped" : ""}`} key={meal.id}><span className="meal-type-label">{meal.meal}</span><strong>{meal.name}</strong><small>{meal.calories} kcal · {meal.protein}g protein <span className="demo-inline">· sample</span></small><div className="plan-actions"><button onClick={() => swapPlanMeal(meal)} aria-label={`Swap ${meal.name}`}><ArrowDownRight size={13} /> Swap</button><button onClick={() => toggleSkipped(meal)}>{meal.status === "skipped" ? <><Check size={13} /> Restore</> : <><X size={13} /> Skip</>}</button></div></div>)}</div></article>; })}</div>
        <div className="content-grid planning-bottom"><article className="card recipe-card"><div className="card-topline"><div><span className="eyebrow">RECIPE MAKER</span><h3>Cook with what you have</h3></div><span className="card-icon icon-sand"><ChefHat size={18} /></span></div><div className="recipe-feature"><span className="recipe-tag">{chosenRecipe.tag} · {chosenRecipe.time}</span><h4>{chosenRecipe.name}</h4><p>A sample recipe idea for your “{data.goal}” focus. AI recipe generation is not connected.</p><div className="ingredient-chips">{chosenRecipe.ingredients.map((item) => <span key={item}>{item}</span>)}</div><div className="recipe-picker">{RECIPE_CARDS.map((recipe, index) => <button key={recipe.name} className={recipeIndex === index ? "recipe-dot active" : "recipe-dot"} onClick={() => setRecipeIndex(index)} aria-label={`Show ${recipe.name}`} />)}</div></div></article><article className="card grocery-card"><div className="card-topline"><div><span className="eyebrow">SHOPPING LIST</span><h3>From this week's plan</h3></div><ShoppingBasket size={19} className="muted-icon" /></div><div className="grocery-categories">{Object.entries(groceryGroups).map(([category, items]) => <div className="grocery-category" key={category}><div><strong>{category}</strong><span>{items.size}</span></div><p>{items.size ? Array.from(items).slice(0, 5).join(" · ") : "Nothing in this group"}{items.size > 5 ? " · more" : ""}</p></div>)}</div><div className="grocery-footer"><Info size={14} /><span>Auto-built from the active sample meals. Skipped meals are excluded.</span></div></article></div>
        <MedicalNote />
      </>
    );
  }

  function renderActivity() {
    const today = new Date().toISOString().slice(0, 10);
    const todayWorkouts = data.workouts.filter((workout) => workout.scheduledDate === today);
    const completeCount = todayWorkouts.filter((workout) => workout.completed).length;
    return (
      <>
        <SectionHeading eyebrow="MOVEMENT & RECOVERY" title="Move in a way that meets you here." description="Plan a small activity and explore sample biometrics. Real device data is not connected." action={<DemoTag>HEALTH CONNECT / HEALTHKIT OFF</DemoTag>} />
        <div className="notice notice-blue"><HeartPulse size={17} /><p><strong>Wearable data is illustrative.</strong> Steps, sleep, heart rate, HRV, and active calories below are examples only. Theraria has not requested access to your health data.</p></div>
        <div className="biometric-grid"><article className="card biometric-card"><div className="bio-heading"><span className="metric-icon icon-mint"><Footprints size={18} /></span><div><span className="eyebrow">DAILY STEPS</span><strong>6,420 <small>/ 10,000</small></strong></div><span className="sample-stamp">SAMPLE</span></div><ProgressBar value={64} /><div className="bio-foot"><span>Example device: Health Connect</span><span>64%</span></div></article><article className="card biometric-card"><div className="bio-heading"><span className="metric-icon icon-sand"><Flame size={18} /></span><div><span className="eyebrow">ACTIVE ENERGY</span><strong>318 <small>kcal</small></strong></div><span className="sample-stamp">SAMPLE</span></div><div className="metric-caption">Illustrative value; no device is synced.</div></article><article className="card biometric-card"><div className="bio-heading"><span className="metric-icon icon-rose"><HeartPulse size={18} /></span><div><span className="eyebrow">RESTING HEART RATE</span><strong>62 <small>bpm</small></strong></div><span className="sample-stamp">SAMPLE</span></div><div className="metric-caption">Not a reading from your watch.</div></article><article className="card biometric-card"><div className="bio-heading"><span className="metric-icon icon-blue"><Moon size={18} /></span><div><span className="eyebrow">SLEEP & RECOVERY</span><strong>7.4 <small>hrs · HRV 48 ms</small></strong></div><span className="sample-stamp">SAMPLE</span></div><div className="metric-caption">Recovery coaching is a demo, not a recommendation.</div></article></div>
        <div className="content-grid activity-layout"><article className="card schedule-card"><div className="card-topline"><div><span className="eyebrow">TODAY'S MOVEMENT</span><h3>Go at your own pace</h3></div><span className="card-icon icon-mint"><Dumbbell size={18} /></span></div><div className="movement-progress"><div><span>Activities checked off</span><strong>{completeCount} / {todayWorkouts.length}</strong></div><ProgressBar value={percent(completeCount, Math.max(1, todayWorkouts.length))} /></div><div className="activity-list">{todayWorkouts.length ? todayWorkouts.map((workout) => <div className="activity-row" key={workout.id}><button className={`check-button ${workout.completed ? "checked" : ""}`} aria-label={workout.completed ? `Mark ${workout.title} incomplete` : `Mark ${workout.title} complete`} onClick={() => toggleWorkout(workout.id)}>{workout.completed && <Check size={15} />}</button><div><strong>{workout.title}</strong><span>{workout.durationMinutes} min · sample {workout.caloriesBurned} kcal</span></div><span className="activity-status">{workout.completed ? "Done" : "Planned"}</span></div>) : <EmptyState icon={Dumbbell} text="Nothing on the schedule yet." />}</div></article><article className="card workout-form-card"><div className="card-topline"><div><span className="eyebrow">ADD A SESSION</span><h3>Make a gentle plan</h3></div><Plus size={17} className="muted-icon" /></div><form className="meal-form" onSubmit={addWorkout}><div className="field-block"><label htmlFor="workout-title">Activity</label><input id="workout-title" value={workoutName} onChange={(event) => setWorkoutName(event.target.value)} placeholder="e.g. easy neighborhood walk" /></div><div className="field-block"><label htmlFor="workout-duration">Duration in minutes</label><input id="workout-duration" type="number" min="1" max="300" value={workoutMinutes} onChange={(event) => setWorkoutMinutes(Number(event.target.value) || 1)} /></div><button className="button button-primary button-wide" type="submit"><Plus size={16} /> Add to schedule</button></form><div className="coach-callout"><Sparkles size={16} /><span>Adaptive coaching using sleep, HRV, or steps is not connected. Listen to your own body.</span></div></article></div><MedicalNote />
      </>
    );
  }

  function renderFoods() {
    const types = ["All foods", ...Array.from(new Set(FOOD_CATALOG.map((food) => food.type)))];
    return (
      <>
        <SectionHeading eyebrow="FOOD LIBRARY" title="Curious about what is on your plate?" description="Search a small sample catalog with nutrition and ingredient notes." action={<DemoTag>SAMPLE CATALOG</DemoTag>} />
        <div className="catalog-search card"><Search size={18} /><input value={foodSearch} onChange={(event) => setFoodSearch(event.target.value)} placeholder="Search foods, ingredients, or meal type" aria-label="Search food catalog" /><span>{filteredFoods.length} items</span></div>
        <div className="catalog-filters">{types.map((type) => <button key={type} className={foodType === type ? "filter-active" : ""} onClick={() => setFoodType(type)}>{type}</button>)}</div>
        <div className="food-grid">{filteredFoods.map((food) => <article className="card food-card" key={food.id}><div className="food-card-head"><span className="food-type">{food.type}</span><span className="cholesterol-pill">Cholesterol: {food.cholesterolCategory} <small>· placeholder</small></span></div><h3>{food.name}</h3><p className="food-desc">{food.description}</p><div className="food-nutrients"><span><strong>{food.calories}</strong> kcal</span><span><strong>{food.protein}g</strong> protein</span><span><strong>{food.carbs}g</strong> carbs</span><span><strong>{food.fats}g</strong> fat</span></div><div className="food-notes"><p><Leaf size={14} /><span>{food.benefits}</span></p><p><Info size={14} /><span>{food.drawbacks}</span></p></div><div className="food-card-footer"><span>{food.origin}</span><span>{food.healthPoints} sample health points · disease points not assessed</span></div><button className="button button-outline button-wide" onClick={() => { setMealName(food.name); setMealCategory(food.type); go("meals"); }}>Add to food journal <Plus size={15} /></button></article>)}</div>
        <MedicalNote />
      </>
    );
  }

  function renderCoach() {
    return (
      <>
        <SectionHeading eyebrow="GENTLE COACH" title="A little encouragement, not a prescription." description="Explore the future AI-coach experience with clearly labeled sample content." action={<DemoTag>GEMINI NOT CONNECTED</DemoTag>} />
        <div className="coach-hero card"><div className="coach-orb"><Sparkles size={28} /></div><div><span className="eyebrow">SAMPLE REFLECTION</span><h2>Consistency is built in small moments.</h2><p>Today’s demo log includes {todayMeals.length} meals and {formatNumber(data.hydrationMl)} ml of water. If it feels right, consider what would make your next meal satisfying—there is no perfect number to hit.</p><small>Generated from sample rules in your browser; no AI service or medical evaluation was used.</small></div></div>
        <div className="content-grid coach-grid"><article className="card ask-card"><div className="card-topline"><div><span className="eyebrow">ASK A QUESTION</span><h3>What are you wondering about?</h3></div><Sparkles size={18} className="muted-icon" /></div><textarea rows={4} value={askText} onChange={(event) => setAskText(event.target.value)} placeholder="e.g. What could I add to make lunch more filling?" /><button className="button button-primary" onClick={() => flash(askText.trim() ? "The Gemini coach is not connected. This question stayed in your browser." : "Type a question to preview the coach flow.")}><Sparkles size={16} /> Preview question</button><p className="field-hint">Questions are not sent anywhere. Medical, blood-sugar, and cholesterol advice is not available in this demo.</p></article><article className="card next-food-card"><div className="card-topline"><div><span className="eyebrow">SAMPLE NEXT-FOOD IDEA</span><h3>Try a small balance</h3></div><Leaf size={18} className="muted-icon" /></div><div className="suggestion-box"><span className="suggestion-icon"><Apple size={19} /></span><div><strong>Fruit with yogurt or nuts</strong><p>A flexible snack pairing from the sample catalog. Adapt it to your preferences and needs.</p></div></div><div className="risk-label-row"><span>Blood-sugar flags</span><strong>Not assessed · demo only</strong></div><div className="risk-label-row"><span>Cholesterol-style estimate</span><strong>Not assessed · methodology TBD</strong></div><div className="risk-label-row"><span>Adaptive workout intensity</span><strong>Not connected</strong></div></article></div><MedicalNote />
      </>
    );
  }

  function renderShare() {
    return (
      <>
        <SectionHeading eyebrow="PROGRESS CARD" title="A snapshot worth celebrating." description="Preview a shareable summary based on local demo entries." action={<DemoTag>EXPORT PREVIEW</DemoTag>} />
        <div className="share-layout"><article className="share-card"><div className="share-card-header"><AppLogo compact /><span>THERARIA · YOUR DAY</span></div><div className="share-card-main"><span className="share-date">{todayLabel}</span><h2>A little more<br /><em>in balance.</em></h2><div className="share-score"><strong>{dayScore}</strong><span>/ 100<br />sample score</span></div></div><div className="share-stats"><div><strong>{formatNumber(dailyTotals.calories)}</strong><span>kcal logged</span></div><div><strong>{formatNumber(data.hydrationMl)} ml</strong><span>water logged</span></div><div><strong>{todayMeals.length}</strong><span>meals noticed</span></div></div><div className="share-card-footer"><span>Small steps, steady days.</span><span>DEMO · NOT MEDICAL ADVICE</span></div></article><div className="share-details"><article className="card"><span className="eyebrow">SHARE PREVIEW</span><h3>Keep it yours.</h3><p>This card summarizes browser-local sample entries. No image export is connected yet; share or copy the text summary instead.</p><button className="button button-primary button-wide" onClick={shareSummary}>{copied ? <Check size={16} /> : <Share2 size={16} />}{copied ? "Shared / copied" : "Share summary"}</button><button className="button button-outline button-wide" onClick={shareSummary}><Copy size={15} /> Copy summary text</button><div className="share-privacy"><Info size={15} /><span>Nothing is published automatically. The browser will show its regular share options if supported.</span></div></article><article className="card credits-card"><div className="card-topline"><div><span className="eyebrow">AI CREDITS</span><h3>A concept, not checkout</h3></div><Sparkles size={18} className="muted-icon" /></div><div className="credit-meter"><span>Demo credits</span><strong>8 <small>/ 10</small></strong><ProgressBar value={80} color="amber" /></div><div className="credit-plan"><span>Free preview</span><small>Limited AI actions · tier details TBD</small><span className="plan-status">NOT FOR SALE</span></div><p className="field-hint">No payment, subscription, credit deduction, or upgrade flow is connected. Pricing and terms require product decisions.</p></article></div></div><MedicalNote />
      </>
    );
  }

  const currentView = active === "overview" ? renderOverview() : active === "meals" ? renderMeals() : active === "plans" ? renderPlans() : active === "activity" ? renderActivity() : active === "foods" ? renderFoods() : active === "coach" ? renderCoach() : renderShare();
  const navGroups = Array.from(new Set(NAV_ITEMS.map((item) => item.group)));

  return (
    <div className="app-frame">
      <aside className="sidebar"><div className="sidebar-brand"><AppLogo /></div><div className="profile-chip"><div className="avatar">A</div><div><strong>Alex Morgan</strong><span>DEMO PROFILE · LOCAL ONLY</span></div><ChevronDown size={15} /></div><nav className="side-nav" aria-label="Main navigation">{navGroups.map((group) => <div className="nav-group" key={group}><span className="nav-group-label">{group}</span>{NAV_ITEMS.filter((item) => item.group === group).map((item) => { const Icon = item.icon; return <button key={item.id} className={`nav-item ${active === item.id ? "nav-item-active" : ""}`} onClick={() => go(item.id)} aria-current={active === item.id ? "page" : undefined}><Icon size={18} strokeWidth={1.8} /><span>{item.label}</span>{item.id === "meals" && <span className="nav-count">{todayMeals.length}</span>}</button>; })}</div>)}</nav><div className="sidebar-spacer" /><div className="sidebar-tip"><span className="tip-icon"><Leaf size={17} /></span><p><strong>Small steps count.</strong><br />No streak has to be perfect.</p></div><div className="sidebar-footer"><span className="connected-dot" />Demo mode <span>· browser storage</span></div></aside>
      <main className="main-column"><header className="topbar"><div className="mobile-brand"><AppLogo compact /><span>theraria</span></div><div className="breadcrumb"><span>Your space</span><ChevronRight size={14} /><strong>{titleFor(active)}</strong></div><div className="topbar-actions"><DemoTag><span className="top-demo-label">DEMO MODE · LOCAL ONLY</span><span className="mobile-demo-label">DEMO</span></DemoTag><button className="topbar-log" onClick={() => go("meals")}><Plus size={15} /> <span>Log meal</span></button></div></header><div className="page-content" key={active}>{currentView}<footer className="app-footer"><AppLogo compact /><span>Theraria · a kinder way to notice your routines</span><button onClick={() => go("coach")}>About demo <ArrowRight size={13} /></button></footer></div></main>
      <nav className="mobile-nav" aria-label="Mobile navigation">{NAV_ITEMS.slice(0, 5).map((item) => { const Icon = item.icon; return <button key={item.id} className={active === item.id ? "mobile-nav-active" : ""} onClick={() => go(item.id)}><Icon size={19} /><span>{item.id === "overview" ? "Home" : item.id === "meals" ? "Meals" : item.id === "plans" ? "Plans" : item.id === "activity" ? "Move" : "Foods"}</span></button>; })}</nav>
      {toast && <div className="toast" role="status"><Check size={16} />{toast}<button onClick={() => setToast("")} aria-label="Dismiss"><X size={14} /></button></div>}
    </div>
  );
}

function MealRow({ meal, onDelete }: { meal: Meal; onDelete?: () => void }) {
  const icon = meal.category === "Breakfast" ? <SunIcon /> : meal.category === "Lunch" ? <Apple size={18} /> : meal.category === "Dinner" ? <Utensils size={18} /> : <Leaf size={18} />;
  return <div className="meal-row"><span className={`meal-avatar ${meal.category.toLowerCase()}`}>{icon}</span><div className="meal-row-main"><strong>{meal.name}</strong><span>{meal.category} · {prettyTime(meal.createdAt)} · {meal.source} entry</span></div><div className="meal-row-nutrition"><strong>{formatNumber(meal.calories)} <small>kcal</small></strong><span>{meal.protein}g protein · {meal.carbs}g carbs</span></div>{onDelete && <button className="icon-button delete-meal" onClick={onDelete} aria-label={`Remove ${meal.name}`}><X size={15} /></button>}</div>;
}

function SunIcon() {
  return <span className="sun-glyph">◒</span>;
}

function EmptyState({ icon: Icon, text, action, onClick }: { icon: LucideIcon; text: string; action?: string; onClick?: () => void }) {
  return <div className="empty-state"><span><Icon size={22} /></span><p>{text}</p>{action && onClick && <button className="text-button" onClick={onClick}>{action} <ArrowRight size={14} /></button>}</div>;
}

function MedicalNote() {
  return <div className="medical-note"><Info size={15} /><span>Theraria is a prototype. Nutrition and activity figures are illustrative, disease/cholesterol signals are not clinically validated, and nothing here is medical advice.</span></div>;
}
