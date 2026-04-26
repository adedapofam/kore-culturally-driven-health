export interface Exercise { id: string; name: string; muscle: string; category: "Compound" | "Isolation"; }

export const EXERCISE_DB: Exercise[] = [
  // Push
  { id: "e1", name: "Bench Press", muscle: "Chest", category: "Compound" },
  { id: "e2", name: "Incline Dumbbell Press", muscle: "Chest", category: "Compound" },
  { id: "e3", name: "Overhead Press", muscle: "Shoulders", category: "Compound" },
  { id: "e4", name: "Lateral Raise", muscle: "Shoulders", category: "Isolation" },
  { id: "e5", name: "Tricep Pushdown", muscle: "Triceps", category: "Isolation" },
  { id: "e6", name: "Dips", muscle: "Chest", category: "Compound" },
  // Pull
  { id: "e10", name: "Deadlift", muscle: "Back", category: "Compound" },
  { id: "e11", name: "Pull-Up", muscle: "Back", category: "Compound" },
  { id: "e12", name: "Barbell Row", muscle: "Back", category: "Compound" },
  { id: "e13", name: "Lat Pulldown", muscle: "Back", category: "Compound" },
  { id: "e14", name: "Bicep Curl", muscle: "Biceps", category: "Isolation" },
  { id: "e15", name: "Face Pull", muscle: "Rear Delts", category: "Isolation" },
  // Legs
  { id: "e20", name: "Back Squat", muscle: "Quads", category: "Compound" },
  { id: "e21", name: "Romanian Deadlift", muscle: "Hamstrings", category: "Compound" },
  { id: "e22", name: "Leg Press", muscle: "Quads", category: "Compound" },
  { id: "e23", name: "Bulgarian Split Squat", muscle: "Quads", category: "Compound" },
  { id: "e24", name: "Leg Curl", muscle: "Hamstrings", category: "Isolation" },
  { id: "e25", name: "Calf Raise", muscle: "Calves", category: "Isolation" },
  { id: "e26", name: "Hip Thrust", muscle: "Glutes", category: "Compound" },
  // Core
  { id: "e30", name: "Plank", muscle: "Core", category: "Isolation" },
  { id: "e31", name: "Hanging Leg Raise", muscle: "Core", category: "Isolation" },
];
