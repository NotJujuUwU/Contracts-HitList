// items.js
const ITEMS = [
  // === Consumables ===
  {
    id: "health-potion",
    name: "Health Potion",
    price: 100,
    type: "consumable",
    icon: "health-potion.png",
    dealer: "Dr. Bethenie",
    use: () => {
      heal(50); // calls dashboard.html heal() with cap
    }
  },
  {
    id: "mana-potion",
    name: "Mana Potion",
    price: 120,
    type: "consumable",
    icon: "mana-potion.png",
    dealer: "Dr. Bethenie",
    use: () => {
      restoreMana(50); // calls dashboard.html restoreMana() with cap
    }
  },

  // === Weapons & Shields ===
  {
    id: "iron-sword",
    name: "Iron Sword",
    price: 500,
    type: "weapon",
    slot: "weapon",          // only 1 weapon at a time
    stats: { damage: 5 },
    icon: "iron-sword.png",
    dealer: "Blacksmith Joey"
  },
  {
    id: "steel-shield",
    name: "Steel Shield",
    price: 700,
    type: "armor",
    slot: "offhand",
    stats: { armor: 8 },
    icon: "steel-shield.png",
    dealer: "Blacksmith Joey"
  },

  // === Iron Armor Set ===
  {
    id: "iron-boots",
    name: "Iron Boots",
    price: 300,
    type: "armor",
    slot: "boots",
    stats: { armor: 5 },
    icon: "iron-boots.png",
    dealer: "Blacksmith Joey"
  },
  {
    id: "iron-leggings",
    name: "Iron Leggings",
    price: 500,
    type: "armor",
    slot: "legs",
    stats: { armor: 10 },
    icon: "iron-leggings.png",
    dealer: "Blacksmith Joey"
  },
  {
    id: "iron-chestplate",
    name: "Iron Chestplate",
    price: 800,
    type: "armor",
    slot: "chest",
    stats: { armor: 15 },
    icon: "iron-chestplate.png",
    dealer: "Blacksmith Joey"
  },
  {
    id: "iron-helmet",
    name: "Iron Helmet",
    price: 400,
    type: "armor",
    slot: "head",
    stats: { armor: 7 },
    icon: "iron-helmet.png",
    dealer: "Blacksmith Joey"
  }
];