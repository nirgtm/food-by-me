const buildRoute = (slug) => `/${slug}`;

const THEMES = {
  biryani: {
    slug: "biryani",
    route: buildRoute("biryani"),
    kicker: "Slow Dum Craft",
    title: "Biryani Atelier",
    subtitle: "Layered rice, deep spice, clean finish.",
    image: "Biryani.jpg",
    accent: "#bf5b17",
    accentSoft: "#f6c79c",
    basePrice: 219,
    priceStep: 11,
    rail: ["Dum Pot", "Saffron", "Charcoal", "Royal Cut", "Spice Bloom", "Steam Lock"],
    items: [
      { name: "Royal Dum Chicken", note: "Long-grain and caramelized onion" },
      { name: "Nawabi Mutton Pot", note: "Bold stock and warm spice finish" },
      { name: "Smoked Veg Zaffran", note: "Garden vegetables with saffron oil" },
      { name: "Pepper Keema Layer", note: "Minced lamb and black pepper heat" },
      { name: "Kolkata Gold", note: "Subtle spice, potato, clarified butter" },
      { name: "Malabar Coast Pot", note: "Herb-forward and coastal aroma" },
      { name: "Fire Char Dum", note: "High heat finish with mint yogurt" },
      { name: "Midnight Masala", note: "Dark spice roast and deep umami" },
    ],
  },
  cakes: {
    slug: "cakes",
    route: buildRoute("cakes"),
    kicker: "Bake Studio",
    title: "Patisserie Line",
    subtitle: "Soft crumb, rich layers, modern finish.",
    image: "Cakes.jpg",
    accent: "#b33d59",
    accentSoft: "#f3bfd1",
    basePrice: 189,
    priceStep: 14,
    rail: ["Whipped", "Layered", "Frosted", "Ganache", "Velvet", "Fresh Bake"],
    items: [
      { name: "Velvet Cocoa Slice", note: "Dark sponge and silk frosting" },
      { name: "Vanilla Cloud", note: "Soft crumb with light cream" },
      { name: "Caramel Drift", note: "Salted caramel and butter glaze" },
      { name: "Berry Studio Cake", note: "Fresh berry reduction and mousse" },
      { name: "Mocha Beam", note: "Coffee cream with cocoa nibs" },
      { name: "Lemon Crumb", note: "Citrus punch and glazed top" },
      { name: "Forest Cherry", note: "Dark chocolate with tart cherry" },
      { name: "Pistachio Silk", note: "Nut cream and flaky crunch" },
    ],
  },
  chinese: {
    slug: "chinese",
    route: buildRoute("chinese"),
    kicker: "Wok Lab",
    title: "Wok Signature",
    subtitle: "Fast toss, high flame, balanced sauces.",
    image: "Chinese.jpg",
    accent: "#b3472c",
    accentSoft: "#f3c2b4",
    basePrice: 159,
    priceStep: 10,
    rail: ["Wok Toss", "Soy Glaze", "Chili Oil", "Steam", "Crunch", "High Flame"],
    items: [
      { name: "Szechuan Noodle Cut", note: "Dry chili heat and toasted garlic" },
      { name: "Crisp Chili Paneer", note: "Light batter and bold glaze" },
      { name: "Smoked Fried Rice", note: "Wok-char aroma and spring onion" },
      { name: "Pepper Corn Bowl", note: "Crunchy corn with black pepper" },
      { name: "Silk Manchurian", note: "Smooth gravy and bite texture" },
      { name: "Ginger Garlic Stir", note: "Fresh ginger lift and soy depth" },
      { name: "Momo Street Set", note: "Steamed fold with house dip" },
      { name: "Shanghai Crunch", note: "Crisp vegetables and sesame finish" },
    ],
  },
  coffee: {
    slug: "coffee",
    route: buildRoute("coffee"),
    kicker: "Roast Room",
    title: "Coffee Reserve",
    subtitle: "Precision brew for sharp mornings.",
    image: "Coffee.jpg",
    accent: "#6d4b3e",
    accentSoft: "#d9c2b7",
    basePrice: 99,
    priceStep: 8,
    rail: ["Single Origin", "Steam", "Microfoam", "Dark Roast", "Cold Brew", "Crema"],
    items: [
      { name: "Espresso Core", note: "Dense body with cocoa end note" },
      { name: "Cappuccino Soft", note: "Foam-heavy and nutty" },
      { name: "Mocha Drift", note: "Chocolate and roast balance" },
      { name: "Flat White Line", note: "Silk milk and short pull" },
      { name: "Cold Brew Ink", note: "Slow steeped and clean" },
      { name: "Hazel Latte", note: "Warm hazelnut with smooth milk" },
      { name: "Caramel Black", note: "No milk, deep roast profile" },
      { name: "Vanilla Bean Brew", note: "Mild sweetness, bright finish" },
    ],
  },
  desserts: {
    slug: "desserts",
    route: buildRoute("desserts"),
    kicker: "Sweet Craft",
    title: "Dessert Gallery",
    subtitle: "Small plates with premium sweetness.",
    image: "Desserts.jpg",
    accent: "#9c4f8b",
    accentSoft: "#ebc7e2",
    basePrice: 129,
    priceStep: 9,
    rail: ["Silk Syrup", "Milk Base", "Nut Dust", "Cold Plate", "Caramel", "Rose Note"],
    items: [
      { name: "Saffron Milk Bowl", note: "Slow reduced milk and dry fruits" },
      { name: "Rose Jam Sphere", note: "Warm syrup and tender center" },
      { name: "Pista Cream Bite", note: "Soft bite with nut cream" },
      { name: "Caramel Halwa Cut", note: "Dense texture and toasted ghee" },
      { name: "Coconut Silk Cup", note: "Light tropical sweetness" },
      { name: "Jaggery Rabri", note: "Rustic milk reduction profile" },
      { name: "Mango Saffron Pot", note: "Fruit-forward and bright" },
      { name: "Almond Kheer", note: "Classic smooth grain finish" },
    ],
  },
  fruits: {
    slug: "fruits",
    route: buildRoute("fruits"),
    kicker: "Fresh Cut Bar",
    title: "Fruit Studio",
    subtitle: "Clean bowls, bright vitamins, zero noise.",
    image: "Fruits.jpg",
    accent: "#2f8f65",
    accentSoft: "#bfead6",
    basePrice: 109,
    priceStep: 7,
    rail: ["Seasonal", "Hydration", "Fiber", "Vitamin C", "Fresh Pick", "Cold Press"],
    items: [
      { name: "Citrus Burst Bowl", note: "Orange, kiwi, mint, lime drizzle" },
      { name: "Berry Lift Cup", note: "Fresh berries and chia seeds" },
      { name: "Tropical Green Mix", note: "Pineapple, mango, basil" },
      { name: "Melon Chill Pack", note: "Hydration-heavy summer cut" },
      { name: "Protein Fruit Jar", note: "Greek yogurt and mixed fruit" },
      { name: "Apple Spice Toss", note: "Crunchy apple and cinnamon" },
      { name: "Pomegranate Crush", note: "Ruby seeds and citrus notes" },
      { name: "Rainbow Seasonal", note: "Chef-picked market selection" },
    ],
  },
  kebabs: {
    slug: "kebabs",
    route: buildRoute("kebabs"),
    kicker: "Grill Section",
    title: "Kebab Foundry",
    subtitle: "High-heat sear, smoky finish, juicy core.",
    image: "kebabs.jpg",
    accent: "#a54c2c",
    accentSoft: "#edc3b2",
    basePrice: 189,
    priceStep: 12,
    rail: ["Skewer", "Char", "Marinade", "Smoke", "Rested", "Tandoor"],
    items: [
      { name: "Flame Chicken Stick", note: "Yogurt marinade and char edges" },
      { name: "Pepper Seekh Roll", note: "Minced spice blend on skewers" },
      { name: "Tandoor Paneer Cut", note: "Smoky cubes with herb oil" },
      { name: "Lamb Char Bar", note: "Juicy center and crisp surface" },
      { name: "Mint Grill Wings", note: "Fresh mint glaze and heat" },
      { name: "Garlic Butter Kebab", note: "Roasted garlic and warm butter" },
      { name: "Red Chili Roast", note: "Bold heat with citrus finish" },
      { name: "Coastal Fish Skewer", note: "Lemon herb and smoke touch" },
    ],
  },
  khichdi: {
    slug: "khichdi",
    route: buildRoute("khichdi"),
    kicker: "Comfort Pot",
    title: "Khichdi Kitchen",
    subtitle: "Soft grain bowls with elevated flavor.",
    image: "khichdi.jpg",
    accent: "#b48a35",
    accentSoft: "#f0dfb4",
    basePrice: 119,
    priceStep: 8,
    rail: ["Comfort", "Ghee", "Soft Grain", "Turmeric", "Roasted", "Balanced"],
    items: [
      { name: "Classic Moong Pot", note: "Simple, buttery, everyday comfort" },
      { name: "Tadka Khichdi", note: "Cumin tempering and garlic oil" },
      { name: "Masala Millet Bowl", note: "Millet base with light spice" },
      { name: "Veg Fusion Pot", note: "Seasonal vegetables and herbs" },
      { name: "Spinach Lentil Mix", note: "Leafy greens with protein blend" },
      { name: "Pepper Ghee Rice", note: "Warm pepper hit and ghee aroma" },
      { name: "Roasted Garlic Pot", note: "Deep garlic notes and soft texture" },
      { name: "Nutri Protein Khichdi", note: "Extra lentils and clean finish" },
    ],
  },
  noodles: {
    slug: "noodles",
    route: buildRoute("noodles"),
    kicker: "Noodle Counter",
    title: "Noodle District",
    subtitle: "Silky strands, punchy sauces, wok heat.",
    image: "Noodles.jpg",
    accent: "#a34232",
    accentSoft: "#f0bcb2",
    basePrice: 149,
    priceStep: 9,
    rail: ["Stir Fry", "Umami", "Sauce Coat", "Steam", "Crunch", "Street Wok"],
    items: [
      { name: "Garlic Toss Noodles", note: "Garlic oil with scallion crunch" },
      { name: "Szechuan Burn", note: "Heat-forward red sauce profile" },
      { name: "Sesame Soy Bowl", note: "Nutty sesame and smooth soy" },
      { name: "Veg Wok Ribbon", note: "Colorful vegetables and soft pull" },
      { name: "Pepper Paneer Noodles", note: "Protein-rich and smoky" },
      { name: "Street Chow Mix", note: "Fast toss and bold spice" },
      { name: "Lemon Chili Udon", note: "Citrus top with mild heat" },
      { name: "Crispy Noodle Stack", note: "Crunch layers and savory sauce" },
    ],
  },
  paratha: {
    slug: "paratha",
    route: buildRoute("paratha"),
    kicker: "Tawa Crafted",
    title: "Paratha House",
    subtitle: "Layered flatbreads with rich fillings.",
    image: "paratha.jpg",
    accent: "#a46b2b",
    accentSoft: "#edd4b0",
    basePrice: 89,
    priceStep: 7,
    rail: ["Layered", "Butter", "Stuffed", "Tawa", "Crisp Edge", "Hot Serve"],
    items: [
      { name: "Aloo Pepper Fold", note: "Potato mash and cracked pepper" },
      { name: "Paneer Mint Roll", note: "Cottage cheese and cool mint" },
      { name: "Onion Chili Layer", note: "Sharp onion and chili flakes" },
      { name: "Cheese Corn Melt", note: "Sweet corn and molten cheese" },
      { name: "Lachha Gold", note: "Flaky layers and butter finish" },
      { name: "Garlic Herb Paratha", note: "Roasted garlic with herb dust" },
      { name: "Keema Flatbread", note: "Minced filling and smoky oil" },
      { name: "Classic Tawa Plain", note: "Simple and clean comfort" },
    ],
  },
  pureveg: {
    slug: "pureveg",
    route: buildRoute("pureveg"),
    kicker: "Green Kitchen",
    title: "Pure Veg Circle",
    subtitle: "Plant-forward plates with modern finish.",
    image: "Pureveg.jpg",
    accent: "#2c7a53",
    accentSoft: "#b9e6d1",
    basePrice: 149,
    priceStep: 10,
    rail: ["Fresh Greens", "Plant Protein", "Clean Oil", "Roasted", "Balanced", "Seasonal"],
    items: [
      { name: "Paneer Char Bowl", note: "Tandoor paneer and herb yogurt" },
      { name: "Dal Noir Pot", note: "Slow-cooked lentils and butter" },
      { name: "Veg Korma Silk", note: "Mild cream and vegetable mix" },
      { name: "Spinach Corn Saute", note: "Leafy greens and sweet corn" },
      { name: "Mushroom Pepper Fry", note: "High heat wok mushroom" },
      { name: "Broccoli Sesame", note: "Toasted sesame and garlic glaze" },
      { name: "Garden Biryani Lite", note: "Aromatic rice and fresh herbs" },
      { name: "Mini Veg Thali", note: "Balanced portions and clean spice" },
    ],
  },
  rasgulla: {
    slug: "rasgulla",
    route: buildRoute("rasgulla"),
    kicker: "Syrup Craft",
    title: "Rasgulla Room",
    subtitle: "Soft sponge sweets with tuned sweetness.",
    image: "rasgulla.jpg",
    accent: "#8f6f33",
    accentSoft: "#ebdfbf",
    basePrice: 119,
    priceStep: 8,
    rail: ["Soft Core", "Sugar Syrup", "Milk Solids", "Rose", "Saffron", "Chilled"],
    items: [
      { name: "Classic White Sphere", note: "Soft bite and light syrup" },
      { name: "Saffron Gold", note: "Warm saffron infusion" },
      { name: "Rose Bloom", note: "Floral note with tender texture" },
      { name: "Pista Cream Drop", note: "Nut garnish and rich center" },
      { name: "Coconut Velvet", note: "Tropical aroma and smooth finish" },
      { name: "Honey Light", note: "Milder sweetness profile" },
      { name: "Royal Mix Box", note: "Assorted premium selection" },
      { name: "Mini Party Pack", note: "Small size, same softness" },
    ],
  },
  shake: {
    slug: "shake",
    route: buildRoute("shake"),
    kicker: "Blend Bar",
    title: "Shake Works",
    subtitle: "Cold, thick, layered flavor blends.",
    image: "shake.jpg",
    accent: "#8a4f7d",
    accentSoft: "#e4c3de",
    basePrice: 139,
    priceStep: 9,
    rail: ["Cold Blend", "Thick Cut", "Fruit Base", "Choco", "Crunch", "Cream Top"],
    items: [
      { name: "Mango Cream Shake", note: "Ripe mango and thick milk base" },
      { name: "Strawberry Frost", note: "Berry blend with chilled finish" },
      { name: "Choco Fudge Spin", note: "Dense cocoa and brownie bits" },
      { name: "Banana Malt", note: "Smooth banana and malt notes" },
      { name: "Blueberry Chill", note: "Fresh berry and cream profile" },
      { name: "Cookie Crunch Blast", note: "Crisp cookie and vanilla" },
      { name: "Caramel Ice Line", note: "Salted caramel with cream" },
      { name: "Royal Nut Blend", note: "Pistachio, almond, saffron touch" },
    ],
  },
  tea: {
    slug: "tea",
    route: buildRoute("tea"),
    kicker: "Leaf Studio",
    title: "Tea Atelier",
    subtitle: "Warm cups, balanced notes, premium leaves.",
    image: "Tea.png",
    accent: "#2f7b5b",
    accentSoft: "#bde5d3",
    basePrice: 79,
    priceStep: 6,
    rail: ["Steep", "Aroma", "Leaf Grade", "Warm Serve", "Clay Cup", "Slow Brew"],
    items: [
      { name: "Masala House Chai", note: "Cardamom, clove, and milk" },
      { name: "Tulsi Green Infusion", note: "Herbal lift and clean finish" },
      { name: "Lemon Ginger Shot", note: "Citrus top and warm spice" },
      { name: "Kashmiri Noon Blend", note: "Soft pink profile and nuts" },
      { name: "Assam Strong Cut", note: "Bold body and brisk finish" },
      { name: "Oolong Calm", note: "Floral mid-note and smooth tail" },
      { name: "Mint Cooler Tea", note: "Cool mint and light sweet" },
      { name: "Elaichi Gold", note: "Classic aromatic street style" },
    ],
  },
};

const ITEM_IMAGES = {
  biryani: [
    "my-biryani-1.jpg",
    "my-biryani-2.jpg",
    "my-biryani-3.jpg",
    "my-biryani-4.jpg",
    "my-biryani-5.jpg",
    "my-biryani-6.jpg",
    "my-biryani-7.jpg",
    "my-biryani-8.jpg",
  ],
  cakes: ["Cakes.jpg", "Desserts.jpg", "Pizza.jpg", "Cakes.jpg"],
  chinese: ["Chinese.jpg", "Noodles.jpg", "Chinese.jpg", "Noodles.jpg"],
  coffee: ["Coffee.jpg", "Tea.png", "Coffee.jpg", "Coffee.jpg"],
  desserts: ["Desserts.jpg", "Cakes.jpg", "rasgulla.jpg", "Desserts.jpg"],
  fruits: ["Fruits.jpg", "shake.jpg", "Fruits.jpg", "Fruits.jpg"],
  kebabs: ["kebabs.jpg", "Biryani.jpg", "kebabs.jpg", "kebabs.jpg"],
  khichdi: ["khichdi.jpg", "Pureveg.jpg", "khichdi.jpg", "khichdi.jpg"],
  noodles: ["Noodles.jpg", "Chinese.jpg", "Noodles.jpg", "Chinese.jpg"],
  paratha: ["paratha.jpg", "Pureveg.jpg", "paratha.jpg", "paratha.jpg"],
  pureveg: ["Pureveg.jpg", "Fruits.jpg", "khichdi.jpg", "Pureveg.jpg"],
  rasgulla: ["rasgulla.jpg", "Desserts.jpg", "rasgulla.jpg", "Cakes.jpg"],
  shake: ["shake.jpg", "Fruits.jpg", "shake.jpg", "shake.jpg"],
  tea: ["Tea.png", "Coffee.jpg", "Tea.png", "Tea.png"],
};

const THEMES_WITH_IMAGES = Object.fromEntries(
  Object.entries(THEMES).map(([slug, theme]) => {
    const pool = ITEM_IMAGES[slug] || [theme.image];
    return [
      slug,
      {
        ...theme,
        items: theme.items.map((item, index) => ({
          ...item,
          image: item.image || pool[index % pool.length] || theme.image,
        })),
      },
    ];
  }),
);

const ALIASES = {
  dessert: "desserts",
  sweet: "desserts",
  pureveg: "pureveg",
  "pure-veg": "pureveg",
  rasgula: "rasgulla",
};

function normalizeSlug(input) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

export const catalogThemes = THEMES_WITH_IMAGES;

export function listCatalogThemes() {
  return Object.values(THEMES_WITH_IMAGES);
}

export function getThemeBySlug(input) {
  const slug = normalizeSlug(input);
  const normalized = ALIASES[slug] || slug;
  const theme = THEMES_WITH_IMAGES[normalized];

  if (theme) return theme;

  const pretty = normalized
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    slug: normalized || "category",
    route: normalized ? buildRoute(normalized) : "/",
    kicker: "Chef Edit",
    title: `${pretty || "Category"} Selection`,
    subtitle: "Premium picks curated for quick ordering.",
    image: "Pizza.jpg",
    accent: "#3f516f",
    accentSoft: "#c7d5ef",
    basePrice: 129,
    priceStep: 9,
    rail: ["Curated", "Trending", "Fresh", "Quick", "Premium", "Chef Pick"],
    items: [
      { name: `${pretty || "Daily"} Signature`, note: "Chef crafted seasonal plate" },
      { name: "Street Classic", note: "Fast prep and crowd favorite" },
      { name: "Loaded Bowl", note: "Balanced texture and rich finish" },
      { name: "House Favorite", note: "Most reordered premium item" },
      { name: "Light Option", note: "Clean profile and soft spice" },
      { name: "Weekend Special", note: "Limited batch kitchen run" },
    ],
  };
}

export function getThemeRoute(input) {
  const slug = normalizeSlug(input);
  const normalized = ALIASES[slug] || slug;
  const theme = THEMES_WITH_IMAGES[normalized];

  if (theme) return theme.route;
  return normalized ? `/category/${normalized}` : "/";
}
