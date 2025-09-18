// items.js
const ITEMS = [
  // === Consumables ===
  {
    id: "health-potion",
    name: "Health Potion",
    price: 100,
    type: "consumable",
    dealer: "Dr. Bethanie",
    use: () => heal(50)
  },
  {
    id: "mana-potion",
    name: "Mana Potion",
    price: 120,
    type: "consumable",
    dealer: "Dr. Bethanie",
    use: () => restoreMana(50)
  },

  // === Weapons & Shields ===
  {
    id: "iron-sword",
    name: "Iron Sword",
    price: 500,
    type: "equipment",
    slot: "weapon",          
    stats: { damage: 5 },
    dealer: "Blacksmith Joey"
  },
  {
    id: "steel-shield",
    name: "Steel Shield",
    price: 700,
    type: "equipment",
    slot: "offhand",
    stats: { armor: 8 },
    dealer: "Blacksmith Joey"
  },

  // === Iron Armor Set ===
  {
    id: "iron-boots",
    name: "Iron Boots",
    price: 300,
    type: "equipment",
    slot: "boots",
    stats: { armor: 5 },
    dealer: "Blacksmith Joey"
  },
  {
    id: "iron-leggings",
    name: "Iron Leggings",
    price: 500,
    type: "equipment",
    slot: "legs",
    stats: { armor: 10 },
    dealer: "Blacksmith Joey"
  },
  {
    id: "iron-chestplate",
    name: "Iron Chestplate",
    price: 800,
    type: "equipment",
    slot: "chest",
    stats: { armor: 15 },
    dealer: "Blacksmith Joey"
  },
  {
    id: "iron-helmet",
    name: "Iron Helmet",
    price: 400,
    type: "equipment",
    slot: "head",
    stats: { armor: 7 },
    dealer: "Blacksmith Joey"
  },

  // === Tools ===
  {
    id: "iron-pickaxe",
    name: "Iron Pickaxe",
    price: 600,
    type: "equipment",
    slot: "tool",
    toolType: "pickaxe",  
    dealer: "Blacksmith Joey",
    description: "A sturdy iron pickaxe, lets you mine ores in dungeons."
  },

  // === Resources ===
  {
    id: "iron-ore",
    name: "Iron Ore",
    price: 50,
    type: "resource",
    description: "A chunk of raw iron. Can be smelted into ingots."
  },
  {
    id: "iron-ingot",
    name: "Iron Ingot",
    price: 150,
    type: "resource",
    description: "A refined bar of iron, crucial for blacksmithing."
  },
  {
    id: "coal",
    name: "Coal",
    price: 50,
    type: "resource",
    dealer: "Blacksmith Joey",
    description: "A lump of coal. Essential fuel for smelting and forging."
  }
];