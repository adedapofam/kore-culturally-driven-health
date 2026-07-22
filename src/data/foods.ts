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

  // West African — expansion batch 1 (Nigerian + Ghanaian)
  { id: "wa1", name: "Pounded Yam", aliases: ["iyan", "poundo"], cuisine: "West African", servingLabel: "1 wrap (300g)", calories: 400, protein: 4, carbs: 95, fat: 0.5, emoji: "🍚" },
  { id: "wa2", name: "Amala", aliases: ["elubo", "yam flour swallow"], cuisine: "West African", servingLabel: "1 wrap (300g)", calories: 330, protein: 3, carbs: 78, fat: 1, emoji: "🟤" },
  { id: "wa3", name: "Cassava Fufu (Akpu)", aliases: ["akpu", "fufu", "cassava fufu", "ghana fufu"], cuisine: "West African", servingLabel: "1 wrap (300g)", calories: 320, protein: 2, carbs: 78, fat: 0.5, emoji: "⚪" },
  { id: "wa4", name: "Semovita", aliases: ["semo", "semolina swallow"], cuisine: "West African", servingLabel: "1 wrap (300g)", calories: 360, protein: 10, carbs: 75, fat: 1.5, emoji: "🥣" },
  { id: "wa5", name: "Tuwo Shinkafa", aliases: ["tuwo", "rice swallow"], cuisine: "West African", servingLabel: "1 wrap (300g)", calories: 330, protein: 6, carbs: 74, fat: 0.5, emoji: "🍙" },
  { id: "wa6", name: "Wheat Swallow", aliases: ["wheat meal", "whole wheat swallow"], cuisine: "West African", servingLabel: "1 wrap (300g)", calories: 340, protein: 12, carbs: 70, fat: 2, emoji: "🌾" },
  { id: "wa7", name: "Starch (Delta)", aliases: ["usi"], cuisine: "West African", servingLabel: "1 wrap (250g)", calories: 300, protein: 1, carbs: 74, fat: 0.5, emoji: "🟡" },
  { id: "wa8", name: "Efo Riro", aliases: ["efo", "spinach stew", "vegetable soup"], cuisine: "West African", servingLabel: "1 serving (250g)", calories: 220, protein: 12, carbs: 8, fat: 16, emoji: "🥬" },
  { id: "wa9", name: "Ogbono Soup", aliases: ["ogbolo", "draw soup", "apon"], cuisine: "West African", servingLabel: "1 serving (250g)", calories: 260, protein: 12, carbs: 10, fat: 20, emoji: "🍲" },
  { id: "wa10", name: "Okra Soup", aliases: ["okro soup", "ila"], cuisine: "West African", servingLabel: "1 serving (200g)", calories: 150, protein: 9, carbs: 8, fat: 10, emoji: "🥗" },
  { id: "wa11", name: "Ewedu", aliases: ["jute leaf soup"], cuisine: "West African", servingLabel: "1 serving (150g)", calories: 60, protein: 4, carbs: 6, fat: 2.5, emoji: "🌿" },
  { id: "wa12", name: "Gbegiri", aliases: ["bean soup yoruba"], cuisine: "West African", servingLabel: "1 serving (150g)", calories: 140, protein: 8, carbs: 16, fat: 5, emoji: "🫘" },
  { id: "wa13", name: "Afang Soup", aliases: ["afang"], cuisine: "West African", servingLabel: "1 serving (250g)", calories: 280, protein: 16, carbs: 8, fat: 21, emoji: "🥬" },
  { id: "wa14", name: "Edikang Ikong", aliases: ["edikaikong", "pumpkin leaf soup"], cuisine: "West African", servingLabel: "1 serving (250g)", calories: 290, protein: 17, carbs: 7, fat: 22, emoji: "🥬" },
  { id: "wa15", name: "Banga Soup", aliases: ["ofe akwu", "palm nut soup"], cuisine: "West African", servingLabel: "1 serving (250g)", calories: 300, protein: 14, carbs: 9, fat: 23, emoji: "🥥" },
  { id: "wa16", name: "Oha Soup", aliases: ["ora soup"], cuisine: "West African", servingLabel: "1 serving (250g)", calories: 250, protein: 13, carbs: 9, fat: 18, emoji: "🍃" },
  { id: "wa17", name: "Nsala Soup", aliases: ["white soup", "ofe nsala"], cuisine: "West African", servingLabel: "1 serving (300g)", calories: 230, protein: 20, carbs: 12, fat: 11, emoji: "🐟" },
  { id: "wa18", name: "Ayamase Stew", aliases: ["ofada stew", "designer stew", "green pepper stew"], cuisine: "West African", servingLabel: "1 serving (150g)", calories: 280, protein: 11, carbs: 6, fat: 23, emoji: "🫑" },
  { id: "wa19", name: "Buka Stew", aliases: ["obe ata", "red stew"], cuisine: "West African", servingLabel: "1 serving (150g)", calories: 230, protein: 10, carbs: 7, fat: 18, emoji: "🍅" },
  { id: "wa20", name: "Groundnut Soup", aliases: ["peanut soup", "nkatenkwan"], cuisine: "West African", servingLabel: "1 serving (250g)", calories: 320, protein: 16, carbs: 14, fat: 23, emoji: "🥜" },
  { id: "wa21", name: "Goat Meat Pepper Soup", aliases: ["pepper soup", "peppersoup"], cuisine: "West African", servingLabel: "1 bowl (350g)", calories: 260, protein: 28, carbs: 6, fat: 13, emoji: "🌶️" },
  { id: "wa22", name: "Catfish Pepper Soup", aliases: ["point and kill", "fish pepper soup"], cuisine: "West African", servingLabel: "1 bowl (400g)", calories: 280, protein: 32, carbs: 5, fat: 14, emoji: "🐟" },
  { id: "wa23", name: "Chicken Pepper Soup", cuisine: "West African", servingLabel: "1 bowl (350g)", calories: 240, protein: 27, carbs: 5, fat: 12, emoji: "🍗" },
  { id: "wa24", name: "Ugu Vegetable Soup", aliases: ["ugu", "fluted pumpkin soup"], cuisine: "West African", servingLabel: "1 serving (250g)", calories: 210, protein: 12, carbs: 8, fat: 15, emoji: "🥬" },
  { id: "wa25", name: "Ofada Rice & Ayamase", aliases: ["ofada"], cuisine: "West African", servingLabel: "1 plate (400g)", calories: 520, protein: 16, carbs: 68, fat: 20, emoji: "🍛" },
  { id: "wa26", name: "Nigerian Fried Rice", cuisine: "West African", servingLabel: "1 plate (250g)", calories: 380, protein: 11, carbs: 58, fat: 12, emoji: "🍚" },
  { id: "wa27", name: "Coconut Rice", cuisine: "West African", servingLabel: "1 plate (250g)", calories: 400, protein: 7, carbs: 60, fat: 15, emoji: "🥥" },
  { id: "wa28", name: "Native Rice", aliases: ["palm oil rice", "local rice", "concoction rice"], cuisine: "West African", servingLabel: "1 plate (300g)", calories: 420, protein: 10, carbs: 62, fat: 15, emoji: "🍚" },
  { id: "wa29", name: "White Rice & Stew", aliases: ["rice and stew"], cuisine: "West African", servingLabel: "1 plate (300g)", calories: 420, protein: 10, carbs: 70, fat: 11, emoji: "🍚" },
  { id: "wa30", name: "Ewa Agoyin", aliases: ["agoyin", "mashed beans"], cuisine: "West African", servingLabel: "1 serving (300g)", calories: 400, protein: 18, carbs: 48, fat: 16, emoji: "🫘" },
  { id: "wa31", name: "Beans Porridge", aliases: ["beans pottage", "ewa riro"], cuisine: "West African", servingLabel: "1 serving (300g)", calories: 350, protein: 17, carbs: 46, fat: 12, emoji: "🫘" },
  { id: "wa32", name: "Akara", aliases: ["kosai", "bean cakes", "acaraje", "akala"], cuisine: "West African", servingLabel: "4 balls (120g)", calories: 280, protein: 11, carbs: 22, fat: 17, emoji: "🧆" },
  { id: "wa33", name: "Ekuru", aliases: ["white moi moi", "ofuloju"], cuisine: "West African", servingLabel: "1 wrap (200g)", calories: 210, protein: 12, carbs: 28, fat: 6, emoji: "⚪" },
  { id: "wa34", name: "Boiled Yam", cuisine: "West African", servingLabel: "3 slices (250g)", calories: 290, protein: 4, carbs: 69, fat: 0.5, emoji: "🍠" },
  { id: "wa35", name: "Asaro (Yam Porridge)", aliases: ["asaro", "yam pottage", "yam porridge"], cuisine: "West African", servingLabel: "1 serving (350g)", calories: 380, protein: 6, carbs: 68, fat: 10, emoji: "🍠" },
  { id: "wa36", name: "Fried Yam", aliases: ["dundun"], cuisine: "West African", servingLabel: "6 pieces (200g)", calories: 340, protein: 4, carbs: 58, fat: 11, emoji: "🍟" },
  { id: "wa37", name: "Boli (Roasted Plantain)", aliases: ["bole", "roasted plantain"], cuisine: "West African", servingLabel: "1 plantain (200g)", calories: 240, protein: 2.5, carbs: 62, fat: 0.7, emoji: "🍌" },
  { id: "wa38", name: "Plantain Porridge", aliases: ["plantain pottage"], cuisine: "West African", servingLabel: "1 serving (350g)", calories: 360, protein: 6, carbs: 62, fat: 10, emoji: "🍌" },
  { id: "wa39", name: "Beans & Plantain", aliases: ["beans and dodo"], cuisine: "West African", servingLabel: "1 plate (350g)", calories: 430, protein: 15, carbs: 62, fat: 14, emoji: "🍛" },
  { id: "wa40", name: "Gizdodo", aliases: ["gizzard and plantain", "gizdodo"], cuisine: "West African", servingLabel: "1 serving (300g)", calories: 450, protein: 25, carbs: 45, fat: 19, emoji: "🍢" },
  { id: "wa41", name: "Puff Puff", aliases: ["bofrot", "boflot", "puffpuff", "mikate"], cuisine: "West African", servingLabel: "4 balls (120g)", calories: 380, protein: 5, carbs: 55, fat: 15, emoji: "🍩" },
  { id: "wa42", name: "Chin Chin", aliases: ["chinchin"], cuisine: "West African", servingLabel: "1 cup (100g)", calories: 450, protein: 7, carbs: 60, fat: 20, emoji: "🍪" },
  { id: "wa43", name: "Akamu (Pap)", aliases: ["pap", "ogi", "koko", "corn pap"], cuisine: "West African", servingLabel: "1 bowl (300g)", calories: 180, protein: 3, carbs: 40, fat: 1, emoji: "🥣" },
  { id: "wa44", name: "Agege Bread", aliases: ["agege"], cuisine: "West African", servingLabel: "3 slices (100g)", calories: 270, protein: 8, carbs: 52, fat: 3, emoji: "🍞" },
  { id: "wa45", name: "Bread & Akara", cuisine: "West African", servingLabel: "1 sandwich (250g)", calories: 480, protein: 14, carbs: 62, fat: 19, emoji: "🥪" },
  { id: "wa46", name: "Yam & Egg Sauce", aliases: ["yam and egg"], cuisine: "West African", servingLabel: "1 plate (350g)", calories: 460, protein: 15, carbs: 62, fat: 17, emoji: "🍳" },
  { id: "wa47", name: "Indomie & Egg", aliases: ["indomie", "instant noodles"], cuisine: "West African", servingLabel: "1 plate (350g)", calories: 510, protein: 16, carbs: 62, fat: 22, emoji: "🍜" },
  { id: "wa48", name: "Okpa", aliases: ["bambara nut pudding"], cuisine: "West African", servingLabel: "1 wrap (250g)", calories: 340, protein: 15, carbs: 38, fat: 14, emoji: "🟡" },
  { id: "wa49", name: "Abacha", aliases: ["african salad", "abacha ncha"], cuisine: "West African", servingLabel: "1 plate (300g)", calories: 400, protein: 8, carbs: 48, fat: 19, emoji: "🥗" },
  { id: "wa50", name: "Nkwobi", aliases: ["cow foot spicy"], cuisine: "West African", servingLabel: "1 bowl (250g)", calories: 380, protein: 26, carbs: 6, fat: 28, emoji: "🍖" },
  { id: "wa51", name: "Meat Pie", cuisine: "West African", servingLabel: "1 pie (150g)", calories: 420, protein: 11, carbs: 42, fat: 23, emoji: "🥧" },
  { id: "wa52", name: "Fish Roll", cuisine: "West African", servingLabel: "1 roll (120g)", calories: 330, protein: 9, carbs: 36, fat: 17, emoji: "🐟" },
  { id: "wa53", name: "Gala (Sausage Roll)", aliases: ["gala"], cuisine: "West African", servingLabel: "1 roll (65g)", calories: 210, protein: 5, carbs: 26, fat: 9, emoji: "🌭" },
  { id: "wa54", name: "Nigerian Buns", aliases: ["buns"], cuisine: "West African", servingLabel: "2 pieces (120g)", calories: 400, protein: 6, carbs: 52, fat: 18, emoji: "🍩" },
  { id: "wa55", name: "Egg Roll (Nigerian)", aliases: ["egg roll"], cuisine: "West African", servingLabel: "1 roll (150g)", calories: 390, protein: 11, carbs: 40, fat: 20, emoji: "🥚" },
  { id: "wa56", name: "Plantain Chips", aliases: ["kpekere", "ipekere"], cuisine: "West African", servingLabel: "1 pack (60g)", calories: 300, protein: 1.5, carbs: 38, fat: 16, emoji: "🍌" },
  { id: "wa57", name: "Roasted Groundnut", aliases: ["groundnut", "peanuts"], cuisine: "West African", servingLabel: "1 cup (50g)", calories: 290, protein: 13, carbs: 8, fat: 24, emoji: "🥜" },
  { id: "wa58", name: "Kilishi", aliases: ["nigerian jerky"], cuisine: "West African", servingLabel: "2 sheets (50g)", calories: 180, protein: 27, carbs: 6, fat: 5, emoji: "🥩" },
  { id: "wa59", name: "Grilled Tilapia", cuisine: "West African", servingLabel: "1 whole fish (300g)", calories: 340, protein: 52, carbs: 2, fat: 13, emoji: "🐟" },
  { id: "wa60", name: "Fried Titus (Mackerel)", aliases: ["titus", "fried mackerel"], cuisine: "West African", servingLabel: "1 fish (200g)", calories: 420, protein: 34, carbs: 2, fat: 30, emoji: "🐟" },
  { id: "wa61", name: "Stewed Beef", aliases: ["stew meat"], cuisine: "West African", servingLabel: "3 pieces (150g)", calories: 320, protein: 30, carbs: 3, fat: 21, emoji: "🥩" },
  { id: "wa62", name: "Goat Meat (Stewed)", aliases: ["goat meat"], cuisine: "West African", servingLabel: "3 pieces (150g)", calories: 280, protein: 32, carbs: 2, fat: 16, emoji: "🐐" },
  { id: "wa63", name: "Assorted Meat", aliases: ["orisirisi", "assorted"], cuisine: "West African", servingLabel: "1 serving (150g)", calories: 300, protein: 27, carbs: 2, fat: 20, emoji: "🍖" },
  { id: "wa64", name: "Ponmo", aliases: ["kpomo", "cow skin", "canda"], cuisine: "West African", servingLabel: "3 pieces (100g)", calories: 110, protein: 22, carbs: 0, fat: 2.5, emoji: "🟫" },
  { id: "wa65", name: "Peppered Snail", aliases: ["snail", "congo meat"], cuisine: "West African", servingLabel: "3 pieces (100g)", calories: 140, protein: 21, carbs: 5, fat: 4, emoji: "🐌" },
  { id: "wa66", name: "Peppered Gizzard", aliases: ["gizzard"], cuisine: "West African", servingLabel: "1 serving (150g)", calories: 260, protein: 34, carbs: 4, fat: 12, emoji: "🍢" },
  { id: "wa67", name: "Naija Fried Chicken", aliases: ["hard chicken", "fried chicken"], cuisine: "West African", servingLabel: "2 pieces (250g)", calories: 520, protein: 48, carbs: 4, fat: 35, emoji: "🍗" },
  { id: "wa68", name: "Stewed Turkey", aliases: ["turkey"], cuisine: "West African", servingLabel: "2 pieces (200g)", calories: 420, protein: 44, carbs: 3, fat: 26, emoji: "🦃" },
  { id: "wa69", name: "Asun", aliases: ["spicy goat meat", "asun goat"], cuisine: "West African", servingLabel: "1 serving (150g)", calories: 310, protein: 30, carbs: 3, fat: 20, emoji: "🌶️" },
  { id: "wa70", name: "Dodo Gizzard Skewer", aliases: ["chicken suya", "meat skewer"], cuisine: "West African", servingLabel: "2 skewers (150g)", calories: 280, protein: 24, carbs: 14, fat: 15, emoji: "🍢" },
  { id: "wa71", name: "Boiled Egg (Street Style)", aliases: ["boiled egg and pepper"], cuisine: "West African", servingLabel: "2 eggs (110g)", calories: 160, protein: 13, carbs: 2, fat: 11, emoji: "🥚" },
  { id: "wa72", name: "Zobo", aliases: ["sobolo", "hibiscus drink", "bissap"], cuisine: "West African", servingLabel: "1 bottle (300ml)", calories: 90, protein: 0.5, carbs: 22, fat: 0, emoji: "🧃" },
  { id: "wa73", name: "Kunu", aliases: ["kunun zaki", "kunu drink"], cuisine: "West African", servingLabel: "1 bottle (300ml)", calories: 140, protein: 3, carbs: 30, fat: 1.5, emoji: "🥛" },
  { id: "wa74", name: "Chapman", cuisine: "West African", servingLabel: "1 glass (300ml)", calories: 160, protein: 0, carbs: 40, fat: 0, emoji: "🍹" },
  { id: "wa75", name: "Tigernut Milk", aliases: ["kunun aya", "tigernut drink"], cuisine: "West African", servingLabel: "1 bottle (300ml)", calories: 180, protein: 3, carbs: 26, fat: 8, emoji: "🥛" },
  { id: "wa76", name: "Palm Wine", aliases: ["emu", "nkwu"], cuisine: "West African", servingLabel: "1 cup (300ml)", calories: 110, protein: 1, carbs: 15, fat: 0, emoji: "🍶" },
  { id: "wa77", name: "Waakye", aliases: ["waache", "rice and beans ghana"], cuisine: "West African", servingLabel: "1 plate (400g)", calories: 520, protein: 16, carbs: 88, fat: 12, emoji: "🍛" },
  { id: "wa78", name: "Kenkey", aliases: ["komi", "dokunu", "fante kenkey"], cuisine: "West African", servingLabel: "1 ball (300g)", calories: 330, protein: 8, carbs: 72, fat: 1.5, emoji: "🌽" },
  { id: "wa79", name: "Red Red", aliases: ["beans stew ghana"], cuisine: "West African", servingLabel: "1 plate (350g)", calories: 460, protein: 16, carbs: 58, fat: 19, emoji: "🫘" },
  { id: "wa80", name: "Kelewele", aliases: ["spicy fried plantain"], cuisine: "West African", servingLabel: "1 serving (150g)", calories: 270, protein: 2, carbs: 46, fat: 10, emoji: "🍌" },
  { id: "wa81", name: "Ghana Jollof", aliases: ["ghanaian jollof"], cuisine: "West African", servingLabel: "1 plate (250g)", calories: 330, protein: 8, carbs: 56, fat: 9, emoji: "🍚" },
  { id: "wa82", name: "Light Soup with Fufu", aliases: ["light soup", "nkrakra"], cuisine: "West African", servingLabel: "1 bowl (500g)", calories: 420, protein: 26, carbs: 62, fat: 9, emoji: "🍲" },
  { id: "wa83", name: "Palm Nut Soup (Abenkwan)", aliases: ["abenkwan"], cuisine: "West African", servingLabel: "1 serving (300g)", calories: 340, protein: 15, carbs: 10, fat: 27, emoji: "🥥" },
  { id: "wa84", name: "Shito", aliases: ["ghana pepper sauce", "black sauce"], cuisine: "West African", servingLabel: "2 tbsp (30g)", calories: 130, protein: 3, carbs: 5, fat: 11, emoji: "🌶️" },
  { id: "wa85", name: "Tuo Zaafi", aliases: ["TZ", "tuwo zaafi"], cuisine: "West African", servingLabel: "1 serving (400g)", calories: 380, protein: 8, carbs: 80, fat: 2, emoji: "🥣" },
  { id: "wa86", name: "Omo Tuo", aliases: ["rice balls"], cuisine: "West African", servingLabel: "2 balls (300g)", calories: 330, protein: 6, carbs: 72, fat: 1, emoji: "🍙" },
  { id: "wa87", name: "Angwamo", aliases: ["oil rice", "angwa mo"], cuisine: "West African", servingLabel: "1 plate (300g)", calories: 450, protein: 8, carbs: 66, fat: 17, emoji: "🍚" },
  { id: "wa88", name: "Ampesi & Kontomire", aliases: ["ampesi", "kontomire stew", "palava sauce"], cuisine: "West African", servingLabel: "1 plate (450g)", calories: 480, protein: 14, carbs: 70, fat: 17, emoji: "🍠" },
  { id: "wa89", name: "Chichinga", aliases: ["ghana kebab", "khebab"], cuisine: "West African", servingLabel: "2 skewers (150g)", calories: 290, protein: 28, carbs: 8, fat: 16, emoji: "🍢" },
];
