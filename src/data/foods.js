// Protein values sourced from USDA FoodData Central (SR Legacy)
// https://fdc.nal.usda.gov/ — values per 100g edible portion
const foods = [
  // ── 禽肉 ──────────────────────────────────────────────
  { name: "雞胸肉", proteinPer100g: 22.5, portionNote: "一塊約200g" },
  { name: "雞腿肉", proteinPer100g: 19.0, portionNote: "一隻約200g" },
  { name: "火雞胸肉", proteinPer100g: 23.7, portionNote: "一片約150g" },

  // ── 豬肉 ──────────────────────────────────────────────
  { name: "豬里肌", proteinPer100g: 22.4, portionNote: "一片約100g" },
  { name: "豬腱", proteinPer100g: 20.2, portionNote: "一份約150g" },
  { name: "豬五花", proteinPer100g: 9.3, portionNote: "一份約100g" },

  // ── 牛肉 ──────────────────────────────────────────────
  { name: "牛肉片", proteinPer100g: 25.8, portionNote: "一份約150g" },
  { name: "牛絞肉 (瘦)", proteinPer100g: 19.4, portionNote: "一份約100g" },

  // ── 海鮮 ──────────────────────────────────────────────
  { name: "鮭魚", proteinPer100g: 20.1, portionNote: "一片約150g" },
  { name: "鮪魚罐頭", proteinPer100g: 25.5, portionNote: "一罐約170g" },
  { name: "鱈魚", proteinPer100g: 17.8, portionNote: "一片約150g" },
  { name: "鯛魚", proteinPer100g: 20.1, portionNote: "一片約120g" },
  { name: "沙丁魚罐頭", proteinPer100g: 24.6, portionNote: "一罐約100g" },
  { name: "蝦子", proteinPer100g: 20.1, portionNote: "10隻約100g" },
  { name: "花枝/魷魚", proteinPer100g: 15.6, portionNote: "一份約100g" },
  { name: "蛤蜊", proteinPer100g: 12.8, portionNote: "一碗帶殼約300g，肉約100g" },
  { name: "牡蠣", proteinPer100g: 9.0, portionNote: "一顆約15g" },
  { name: "章魚", proteinPer100g: 14.9, portionNote: "一份約100g" },

  // ── 蛋 ────────────────────────────────────────────────
  { name: "雞蛋", proteinPer100g: 12.6, portionNote: "一顆約55g" },
  { name: "水煮蛋", proteinPer100g: 12.6, portionNote: "一顆約55g" },

  // ── 豆類與豆製品 ───────────────────────────────────────
  { name: "板豆腐", proteinPer100g: 8.1, portionNote: "一塊約300g" },
  { name: "嫩豆腐", proteinPer100g: 8.1, portionNote: "一盒約350g" },
  { name: "毛豆", proteinPer100g: 11.0, portionNote: "一碗約100g" },
  { name: "納豆", proteinPer100g: 17.7, portionNote: "一盒約50g" },
  { name: "天貝", proteinPer100g: 18.5, portionNote: "一份約100g" },
  { name: "扁豆 (熟)", proteinPer100g: 9.0, portionNote: "半杯約100g" },
  { name: "黑豆 (熟)", proteinPer100g: 8.9, portionNote: "半杯約100g" },
  { name: "豆漿", proteinPer100g: 3.3, portionNote: "一杯約240ml" },

  // ── 乳製品 ────────────────────────────────────────────
  { name: "牛奶", proteinPer100g: 3.3, portionNote: "一杯240ml約240g" },
  { name: "希臘優格", proteinPer100g: 10.0, portionNote: "一杯約150g" },
  { name: "茅屋起司", proteinPer100g: 12.4, portionNote: "一份約100g" },
  { name: "切達起司", proteinPer100g: 24.9, portionNote: "一片約30g" },

  // ── 堅果與種子 ─────────────────────────────────────────
  { name: "杏仁", proteinPer100g: 21.2, portionNote: "一把約30g" },
  { name: "花生醬", proteinPer100g: 25.1, portionNote: "一匙約15g" },
  { name: "南瓜籽", proteinPer100g: 29.8, portionNote: "一把約30g" },
  { name: "奇亞籽", proteinPer100g: 16.5, portionNote: "一匙約15g" },

  // ── 穀類 ──────────────────────────────────────────────
  { name: "藜麥 (熟)", proteinPer100g: 4.4, portionNote: "一碗約200g" },

  // ── 補充品 ────────────────────────────────────────────
  { name: "蛋白粉 (1匙)", proteinPer100g: 0, portionNote: "一匙固定20g蛋白質", fixedProtein: 20 },
]

export default foods
