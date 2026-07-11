export type CulturalCuisine =
  | "West African" | "Caribbean" | "South Asian" | "East Asian"
  | "Middle Eastern" | "Western" | "East African" | "Latin American";

export interface FoodItem {
  id: string;
  name: string;
  cuisine: CulturalCuisine;
  servingLabel: string; // e.g. "1 cup (200g)"
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  emoji: string;
  isFoodSupplement?: boolean; // for items like beetroot, watermelon, dates
  /** Alternative spellings/names people actually use when searching. */
  aliases?: string[];
}

export const FOOD_DB: FoodItem[] = [
  // West African
  { id: "f1", name: "Jollof Rice", aliases: ["party rice", "jellof"], cuisine: "West African", servingLabel: "1 cup (200g)", calories: 320, protein: 7, carbs: 58, fat: 8, emoji: "🍚" },
  { id: "f2", name: "Fried Plantain (Dodo)", aliases: ["dodo", "plantain", "boli"], cuisine: "West African", servingLabel: "4 slices (100g)", calories: 215, protein: 1.5, carbs: 32, fat: 9, emoji: "🍌" },
  { id: "f3", name: "Egusi Soup", aliases: ["melon seed soup", "egwusi"], cuisine: "West African", servingLabel: "1 bowl (250g)", calories: 380, protein: 22, carbs: 12, fat: 28, emoji: "🥣" },
  { id: "f4", name: "Moi Moi", aliases: ["moimoi", "moin moin", "moyin moyin", "bean pudding"], cuisine: "West African", servingLabel: "1 wrap (180g)", calories: 240, protein: 14, carbs: 26, fat: 9, emoji: "🫘" },
  { id: "f5", name: "Garri (Eba)", aliases: ["eba", "gari", "cassava"], cuisine: "West African", servingLabel: "1 cup (150g)", calories: 350, protein: 1.5, carbs: 84, fat: 0.5, emoji: "🌾" },
  { id: "f6", name: "Suya (Beef)", aliases: ["tsire", "beef skewer"], cuisine: "West African", servingLabel: "150g", calories: 310, protein: 38, carbs: 4, fat: 16, emoji: "🥩" },
  { id: "f7", name: "Banku & Tilapia", aliases: ["banku", "tilapia"], cuisine: "West African", servingLabel: "1 plate", calories: 520, protein: 36, carbs: 62, fat: 14, emoji: "🐟" },

  // Caribbean
  { id: "f10", name: "Jerk Chicken", aliases: ["jerk"], cuisine: "Caribbean", servingLabel: "150g", calories: 290, protein: 36, carbs: 4, fat: 14, emoji: "🍗" },
  { id: "f11", name: "Rice & Peas", aliases: ["rice and peas"], cuisine: "Caribbean", servingLabel: "1 cup (200g)", calories: 340, protein: 9, carbs: 60, fat: 7, emoji: "🍛" },
  { id: "f12", name: "Ackee & Saltfish", cuisine: "Caribbean", servingLabel: "1 plate (200g)", calories: 380, protein: 24, carbs: 12, fat: 28, emoji: "🐟" },
  { id: "f13", name: "Curry Goat", cuisine: "Caribbean", servingLabel: "200g", calories: 410, protein: 32, carbs: 8, fat: 28, emoji: "🍲" },
  { id: "f14", name: "Festival (Dumpling)", cuisine: "Caribbean", servingLabel: "1 piece", calories: 180, protein: 3, carbs: 28, fat: 6, emoji: "🥖" },

  // South Asian
  { id: "f20", name: "Dal (Lentil Curry)", cuisine: "South Asian", servingLabel: "1 bowl (200g)", calories: 220, protein: 14, carbs: 32, fat: 4, emoji: "🍲" },
  { id: "f21", name: "Roti (Whole Wheat)", cuisine: "South Asian", servingLabel: "1 piece (40g)", calories: 110, protein: 3, carbs: 20, fat: 2, emoji: "🫓" },
  { id: "f22", name: "Chicken Biryani", cuisine: "South Asian", servingLabel: "1 plate (300g)", calories: 520, protein: 28, carbs: 62, fat: 18, emoji: "🍛" },
  { id: "f23", name: "Paneer Tikka", cuisine: "South Asian", servingLabel: "150g", calories: 340, protein: 20, carbs: 8, fat: 26, emoji: "🧀" },
  { id: "f24", name: "Chana Masala", cuisine: "South Asian", servingLabel: "1 bowl", calories: 280, protein: 12, carbs: 38, fat: 9, emoji: "🥘" },
  { id: "f25", name: "Tandoori Chicken", cuisine: "South Asian", servingLabel: "150g", calories: 260, protein: 38, carbs: 3, fat: 11, emoji: "🍗" },

  // East Asian
  { id: "f30", name: "Steamed Dim Sum (Shumai)", cuisine: "East Asian", servingLabel: "4 pieces", calories: 220, protein: 14, carbs: 22, fat: 8, emoji: "🥟" },
  { id: "f31", name: "Beef Pho", cuisine: "East Asian", servingLabel: "1 bowl", calories: 380, protein: 28, carbs: 48, fat: 8, emoji: "🍜" },
  { id: "f32", name: "Stir-Fried Bok Choy", cuisine: "East Asian", servingLabel: "1 cup", calories: 70, protein: 3, carbs: 6, fat: 4, emoji: "🥬" },
  { id: "f33", name: "Sushi (Salmon, 6 pc)", cuisine: "East Asian", servingLabel: "6 pieces", calories: 290, protein: 20, carbs: 38, fat: 6, emoji: "🍣" },
  { id: "f34", name: "Mapo Tofu", cuisine: "East Asian", servingLabel: "1 bowl", calories: 320, protein: 22, carbs: 14, fat: 20, emoji: "🌶️" },

  // Middle Eastern
  { id: "f40", name: "Hummus & Pita", cuisine: "Middle Eastern", servingLabel: "100g + 1 pita", calories: 360, protein: 12, carbs: 50, fat: 14, emoji: "🥙" },
  { id: "f41", name: "Chicken Shawarma", cuisine: "Middle Eastern", servingLabel: "1 wrap", calories: 480, protein: 34, carbs: 42, fat: 18, emoji: "🌯" },
  { id: "f42", name: "Tabbouleh", cuisine: "Middle Eastern", servingLabel: "1 cup", calories: 160, protein: 4, carbs: 18, fat: 9, emoji: "🥗" },
  { id: "f43", name: "Lamb Kofta", cuisine: "Middle Eastern", servingLabel: "150g", calories: 380, protein: 26, carbs: 4, fat: 28, emoji: "🍢" },
  { id: "f44", name: "Falafel", cuisine: "Middle Eastern", servingLabel: "4 pieces", calories: 280, protein: 11, carbs: 30, fat: 14, emoji: "🧆" },

  // Western
  { id: "f50", name: "Grilled Chicken Breast", cuisine: "Western", servingLabel: "150g", calories: 240, protein: 45, carbs: 0, fat: 5, emoji: "🍗" },
  { id: "f51", name: "Oats with Berries", cuisine: "Western", servingLabel: "1 bowl (250g)", calories: 290, protein: 9, carbs: 52, fat: 5, emoji: "🥣" },
  { id: "f52", name: "Eggs (2 large)", cuisine: "Western", servingLabel: "2 eggs", calories: 155, protein: 13, carbs: 1, fat: 11, emoji: "🥚" },
  { id: "f53", name: "Greek Yogurt", cuisine: "Western", servingLabel: "170g", calories: 100, protein: 17, carbs: 6, fat: 0, emoji: "🥛" },
  { id: "f54", name: "Avocado Toast", cuisine: "Western", servingLabel: "1 slice", calories: 280, protein: 8, carbs: 28, fat: 16, emoji: "🥑" },
  { id: "f55", name: "Salmon Fillet", cuisine: "Western", servingLabel: "150g", calories: 310, protein: 34, carbs: 0, fat: 19, emoji: "🐟" },

  // East African
  { id: "f60", name: "Injera with Doro Wat", cuisine: "East African", servingLabel: "1 plate", calories: 540, protein: 32, carbs: 68, fat: 16, emoji: "🍛" },
  { id: "f61", name: "Ugali", cuisine: "East African", servingLabel: "1 cup (180g)", calories: 320, protein: 7, carbs: 70, fat: 1, emoji: "🌽" },

  // Latin American
  { id: "f70", name: "Arroz con Pollo", cuisine: "Latin American", servingLabel: "1 plate", calories: 480, protein: 28, carbs: 56, fat: 14, emoji: "🍛" },
  { id: "f71", name: "Black Bean Bowl", cuisine: "Latin American", servingLabel: "1 bowl", calories: 340, protein: 16, carbs: 52, fat: 6, emoji: "🫘" },

  // Food-based supplements
  { id: "s1", name: "Watermelon", cuisine: "Western", servingLabel: "2 cups (300g)", calories: 90, protein: 2, carbs: 22, fat: 0, emoji: "🍉", isFoodSupplement: true },
  { id: "s2", name: "Beetroot (Roasted)", cuisine: "Western", servingLabel: "1 cup (170g)", calories: 75, protein: 3, carbs: 17, fat: 0, emoji: "🥬", isFoodSupplement: true },
  { id: "s3", name: "Medjool Dates", cuisine: "Middle Eastern", servingLabel: "3 dates", calories: 200, protein: 2, carbs: 54, fat: 0, emoji: "🌴", isFoodSupplement: true },
  { id: "s4", name: "Mixed Nuts", cuisine: "Western", servingLabel: "30g", calories: 180, protein: 6, carbs: 6, fat: 16, emoji: "🥜", isFoodSupplement: true },
  { id: "s5", name: "Coconut Water", cuisine: "Caribbean", servingLabel: "330ml", calories: 60, protein: 1, carbs: 14, fat: 0, emoji: "🥥", isFoodSupplement: true },
];

export const CUISINES: CulturalCuisine[] = [
  "West African", "Caribbean", "South Asian", "East Asian",
  "Middle Eastern", "East African", "Latin American", "Western",
];
