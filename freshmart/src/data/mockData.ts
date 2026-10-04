import { Category, Product, DeliveryAddress, Coupon, Order, User, StoreMember, StaffWorkItem, AuditLogEntry, DarkStoreInfo, WeightVariant, CutOption } from '../types';

export const DEFAULT_DARK_STORES: DarkStoreInfo[] = [
  {
    id: 'ds-mission-04',
    name: 'FreshMart Dark Store #04 (T. Nagar)',
    city: 'Chennai, Tamil Nadu',
    address: 'Pondy Bazaar, T. Nagar',
    distanceKm: 1.3,
    etaMinutes: 11,
    activeRidersCount: 16,
    packingQueueCount: 3,
    temperatureCelsius: 3.2,
    status: 'Lightning Fast'
  },
  {
    id: 'ds-soma-02',
    name: 'FreshMart Farm Hub #02 (Mylapore)',
    city: 'Chennai, Tamil Nadu',
    address: 'Luz Church Road, Mylapore',
    distanceKm: 2.3,
    etaMinutes: 14,
    activeRidersCount: 12,
    packingQueueCount: 5,
    temperatureCelsius: 3.8,
    status: 'Optimal'
  },
  {
    id: 'ds-richmond-07',
    name: 'FreshMart Dark Store #07 (Adyar)',
    city: 'Chennai, Tamil Nadu',
    address: 'LB Road, Adyar',
    distanceKm: 3.5,
    etaMinutes: 18,
    activeRidersCount: 9,
    packingQueueCount: 7,
    temperatureCelsius: 4.0,
    status: 'High Demand'
  }
];

export const CATEGORIES: Category[] = [
  {
    id: 'fruits-veg',
    name: 'Fruits & Vegetables',
    itemCount: 48,
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80',
    description: 'Crisp seasonal fruits, leafy greens, and farm-harvested organic roots',
  },
  {
    id: 'dairy-eggs',
    name: 'Dairy & Farm Eggs',
    itemCount: 36,
    image: 'https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=600&q=80',
    description: 'Whole pasture milk, churned farm butter, artisanal cheeses, and free-range eggs',
  },
  {
    id: 'bakery',
    name: 'Bakery & Sourdough',
    itemCount: 24,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    description: 'Oven-baked crusty artisan bread, morning bagels, and stone-ground multigrain loaves',
  },
  {
    id: 'organic-pantry',
    name: 'Pantry & Organic Grains',
    itemCount: 52,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    description: 'Cold-pressed extra virgin olive oils, unpolished basmati rice, lentils, and organic flours',
  },
  {
    id: 'beverages',
    name: 'Cold-Pressed & Beverages',
    itemCount: 30,
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?auto=format&fit=crop&w=600&q=80',
    description: 'Pure valencia orange juice, sparkling kombucha, roasted single-origin coffees, and herbal teas',
  },
  {
    id: 'snacks',
    name: 'Snacks & Dry Fruits',
    itemCount: 42,
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=600&q=80',
    description: 'California roasted almonds, Medjool dates, Himalayan pink salt kettle chips, and granola clusters',
  },
  {
    id: 'household',
    name: 'Kitchen & Eco Essentials',
    itemCount: 28,
    image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=600&q=80',
    description: 'Plant-based biodegradable detergents, unbleached parchment, and non-toxic home cleansers',
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Organic Hass Avocados',
    brand: 'Napa Harvest',
    category: 'fruits-veg',
    unit: 'Pack of 3 (approx. 450g)',
    price: 189,
    mrp: 229,
    discountPercent: 22,
    rating: 4.8,
    reviewCount: 312,
    inStock: true,
    stockCount: 64,
    sku: 'FM-VEG-001',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Buttery, rich Hass avocados cultivated under California sunshine. Harvested at optimal firmness, perfect for guacamole, morning sourdough toast, or sliced into garden salads.',
    origin: 'Salinas Valley, CA',
    dietary: ['Organic', 'Farm Fresh', 'Vegan'],
    nutrition: {
      calories: 160,
      protein: '2g',
      carbs: '8.5g',
      fat: '14.7g',
      fiber: '6.7g'
    },
    storage: 'Store at room temperature until ripe, then refrigerate up to 5 days.',
    isDeal: true,
    featured: true,
    harvestTime: 'Today, 5:15 AM (Morning Farm Batch)',
    freshnessScore: 99,
    darkStoreName: 'Zepto Dark Store #04',
    deliveryEtaMins: 11,
    recentOrdersCount: 28,
    weightVariants: [
      { id: 'w-1', label: 'Pack of 2 (300g)', price: 129, mrp: 159 },
      { id: 'w-2', label: 'Pack of 3 (450g)', price: 189, mrp: 229, isPopular: true },
      { id: 'w-3', label: 'Family Box 1kg (6→"7 pcs)', price: 399, mrp: 479 }
    ],
    cutOptions: [
      { type: 'whole', label: 'Whole Firm-Ripe' },
      { type: 'sliced', label: 'Salad Slices (Vacuum Sealed)', extraPrice: 20, description: 'Evenly sliced in sterile kitchen' },
      { type: 'diced', label: 'Ready-to-Mash Guacamole Cut', extraPrice: 25, description: 'Diced without seed or skin' }
    ]
  },
  {
    id: 'prod-2',
    name: 'Farm Fresh Organic Whole Milk',
    brand: 'Clover Meadows',
    category: 'dairy-eggs',
    unit: '1 Litre Bottle',
    price: 72,
    mrp: 78,
    discountPercent: 13,
    rating: 4.9,
    reviewCount: 840,
    inStock: true,
    stockCount: 82,
    sku: 'FM-DAI-002',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
    description: '100% pasture-raised whole milk, gently pasteurized and non-homogenized to preserve the natural cream top. Rich in calcium and vitamin D.',
    origin: 'Sonoma Pastures',
    dietary: ['Organic', 'Farm Fresh', 'Non-GMO'],
    nutrition: {
      calories: 150,
      protein: '8g',
      carbs: '12g',
      fat: '8g',
      fiber: '0g'
    },
    storage: 'Keep refrigerated at 34°F - 38°F. Best consumed within 7 days of opening.',
    isDeal: false,
    featured: true,
    harvestTime: 'Bottled Today 4:30 AM · Chilled < 3.5°C',
    freshnessScore: 100,
    darkStoreName: 'Zepto Dark Store #04',
    deliveryEtaMins: 11,
    recentOrdersCount: 42,
    weightVariants: [
      { id: 'wm-1', label: '500 ml Bottle', price: 38, mrp: 42 },
      { id: 'wm-2', label: '2 Litre Family Pack', price: 140, mrp: 152 },
      { id: 'wm-3', label: '1 Litre Bottle', price: 72, mrp: 78, isPopular: true }
    ]
  },
  {
    id: 'prod-3',
    name: 'Artisan Country Sourdough Loaf',
    brand: 'Stone Mill Bakery',
    category: 'bakery',
    unit: '750g whole loaf',
    price: 299,
    mrp: 349,
    discountPercent: 13,
    rating: 4.7,
    reviewCount: 195,
    inStock: true,
    stockCount: 23,
    sku: 'FM-BAK-003',
    image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80',
    description: 'Slow-fermented for 36 hours using an heirloom starter and stone-ground organic unbleached wheat flour. Blistered caramelized crust with a soft, open, airy crumb.',
    origin: 'Local Hearth Bakery',
    dietary: ['Vegan', 'Non-GMO'],
    nutrition: {
      calories: 140,
      protein: '5g',
      carbs: '28g',
      fat: '0.8g',
      fiber: '2.1g'
    },
    storage: 'Store cut side down in paper or linen bag at room temperature.',
    isDeal: false,
    featured: true,
    harvestTime: 'Baked Today 5:45 AM Hearth',
    freshnessScore: 98,
    darkStoreName: 'Zepto Dark Store #04',
    deliveryEtaMins: 12,
    recentOrdersCount: 19,
    weightVariants: [
      { id: 'wb-1', label: 'Half Loaf (375g)', price: 159, mrp: 189 },
      { id: 'wb-2', label: 'Whole Loaf (750g)', price: 299, mrp: 349, isPopular: true }
    ],
    cutOptions: [
      { type: 'whole', label: 'Uncut Whole Loaf (Max Crust Freshness)' },
      { type: 'sliced', label: 'Sandwich Slices (Medium Cut)', extraPrice: 15, description: 'Precision bakery sliced' },
      { type: 'sliced', label: 'Artisan Thick Toast Slices', extraPrice: 15, description: 'Great for French toast' }
    ]
  },
  {
    id: 'prod-4',
    name: 'Cold-Pressed Extra Virgin Olive Oil',
    brand: 'Terra Antica',
    category: 'organic-pantry',
    unit: '750 ml Glass Bottle',
    price: 899,
    mrp: 1099,
    discountPercent: 19,
    rating: 4.9,
    reviewCount: 420,
    inStock: true,
    stockCount: 35,
    sku: 'FM-PAN-004',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    description: 'Single-estate Koroneiki olives cold-extracted within 4 hours of tree shaking. Grassy aroma with balanced notes of green almond and a peppery polyphenol finish.',
    origin: 'Crete Estate, Greece',
    dietary: ['Organic', 'Vegan', 'Non-GMO'],
    nutrition: {
      calories: 120,
      protein: '0g',
      carbs: '0g',
      fat: '14g',
      fiber: '0g'
    },
    storage: 'Keep in cool, dark pantry away from heat sources and direct sunlight.',
    isDeal: true,
    featured: true,
    harvestTime: 'Single Estate Fresh Press',
    freshnessScore: 97,
    darkStoreName: 'Zepto Dark Store #04',
    deliveryEtaMins: 11,
    recentOrdersCount: 16,
    weightVariants: [
      { id: 'wo-1', label: '500 ml Bottle', price: 599, mrp: 699 },
      { id: 'wo-2', label: '750 ml Glass Bottle', price: 899, mrp: 1099, isPopular: true },
      { id: 'wo-3', label: '1.5L Value Tin', price: 1699, mrp: 1999 }
    ]
  },
  {
    id: 'prod-5',
    name: 'Pasture-Raised Brown Heritage Eggs',
    brand: 'Vital Roost',
    category: 'dairy-eggs',
    unit: 'Dozen (12 Grade A Large)',
    price: 119,
    mrp: 139,
    discountPercent: 12,
    rating: 4.8,
    reviewCount: 560,
    inStock: true,
    stockCount: 14,
    sku: 'FM-DAI-005',
    image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=800&q=80',
    description: 'Hens roam freely outdoors on rotating green pastures with 108 sq. ft. per bird. Plump deep orange marigold yolks packed with natural Omega-3 fatty acids.',
    origin: 'Rolling Hills Family Farm',
    dietary: ['Farm Fresh', 'Non-GMO'],
    nutrition: {
      calories: 70,
      protein: '6g',
      carbs: '0g',
      fat: '5g',
      fiber: '0g'
    },
    storage: 'Refrigerate immediately between 35°F and 40°F.',
    isDeal: false,
    featured: false,
    harvestTime: 'Collected Today 6:00 AM',
    freshnessScore: 100,
    darkStoreName: 'Zepto Dark Store #04',
    deliveryEtaMins: 11,
    recentOrdersCount: 54,
    weightVariants: [
      { id: 'we-1', label: 'Half Dozen (6 eggs)', price: 65, mrp: 75 },
      { id: 'we-2', label: '1 Dozen (12 Large)', price: 119, mrp: 139, isPopular: true },
      { id: 'we-3', label: 'Tray of 30 Eggs', price: 285, mrp: 325 }
    ]
  },
  {
    id: 'prod-6',
    name: 'Organic Honeycrisp Crisp Apples',
    brand: 'Cascade Orchards',
    category: 'fruits-veg',
    unit: '1 kg (approx. 4→"5 apples)',
    price: 279,
    mrp: 329,
    discountPercent: 24,
    rating: 4.9,
    reviewCount: 288,
    inStock: true,
    stockCount: 48,
    sku: 'FM-VEG-006',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80',
    description: 'Celebrated for explosive crunch and honey-tart sweetness. Hand-picked at mountain elevation in Washington state, un-waxed and 100% certified organic.',
    origin: 'Yakima Valley, WA',
    dietary: ['Organic', 'Farm Fresh', 'Vegan'],
    nutrition: {
      calories: 95,
      protein: '0.5g',
      carbs: '25g',
      fat: '0.3g',
      fiber: '4.4g'
    },
    storage: 'Keep in crisper drawer for up to 3 weeks.',
    isDeal: true,
    featured: true,
    harvestTime: 'Today 5:00 AM Morning Orchard Batch',
    freshnessScore: 98,
    darkStoreName: 'Zepto Dark Store #04',
    deliveryEtaMins: 11,
    recentOrdersCount: 37,
    weightVariants: [
      { id: 'wa-1', label: '500g (2→"3 apples)', price: 149, mrp: 179 },
      { id: 'wa-2', label: '1 kg (4→"5 apples)', price: 279, mrp: 329, isPopular: true },
      { id: 'wa-3', label: '2 kg Value Box', price: 529, mrp: 629 }
    ],
    cutOptions: [
      { type: 'whole', label: 'Whole Crisp Apples' },
      { type: 'sliced', label: 'Cored & Wedged (Treated with Vitamin C)', extraPrice: 20, description: 'Ready to snack, no browning' }
    ]
  },
  {
    id: 'prod-7',
    name: 'Fresh Hydroponic Baby Spinach',
    brand: 'Verdant Greens',
    category: 'fruits-veg',
    unit: '300g clamshell pack',
    price: 99,
    mrp: 119,
    discountPercent: 20,
    rating: 4.6,
    reviewCount: 167,
    inStock: true,
    stockCount: 18,
    sku: 'FM-VEG-007',
    image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80',
    description: 'Triple-washed tender baby spinach leaves grown in pristine vertical indoor farms using 95% less water. Zero pesticides, vibrant crisp leaves.',
    origin: 'Local Controlled Agriculture',
    dietary: ['Organic', 'Farm Fresh', 'Vegan'],
    nutrition: {
      calories: 23,
      protein: '2.9g',
      carbs: '3.6g',
      fat: '0.4g',
      fiber: '2.2g'
    },
    storage: 'Keep chilled in breathable container with a dry cloth.',
    isDeal: false,
    featured: false,
    harvestTime: 'Harvested Today 4:45 AM Vertical Farm',
    freshnessScore: 100,
    darkStoreName: 'Zepto Dark Store #04',
    deliveryEtaMins: 10,
    recentOrdersCount: 26,
    weightVariants: [
      { id: 'ws-1', label: '150g Box', price: 55, mrp: 65 },
      { id: 'ws-2', label: '300g Clamshell', price: 99, mrp: 119, isPopular: true },
      { id: 'ws-3', label: '500g Value Pack', price: 155, mrp: 179 }
    ],
    cutOptions: [
      { type: 'whole', label: 'Whole Tender Leaves (Triple Washed)' },
      { type: 'diced', label: 'Chef Chopped (Ready for Saute / Dal)', extraPrice: 15, description: 'Sterile cut, ready to cook' }
    ]
  },
  {
    id: 'prod-8',
    name: 'Pure Cold-Pressed Orange Valencia',
    brand: 'Grove Direct',
    category: 'beverages',
    unit: '1 Liter Bottle',
    price: 179,
    mrp: 199,
    discountPercent: 16,
    rating: 4.7,
    reviewCount: 220,
    inStock: true,
    stockCount: 40,
    sku: 'FM-BEV-008',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80',
    description: 'Squeezed fresh from sun-drenched Valencia oranges with light pulp. Never from concentrate, zero added sugar, no artificial preservatives.',
    origin: 'Florida Citrus Groves',
    dietary: ['Vegan', 'Gluten-Free', 'Non-GMO'],
    nutrition: {
      calories: 110,
      protein: '2g',
      carbs: '26g',
      fat: '0g',
      fiber: '1g'
    },
    storage: 'Shake well before pouring. Keep refrigerated under 38°F.',
    isDeal: true,
    featured: false,
    harvestTime: 'Squeezed Today 5:30 AM Florida Grove',
    freshnessScore: 99,
    darkStoreName: 'Zepto Dark Store #04',
    deliveryEtaMins: 10,
    recentOrdersCount: 22,
    weightVariants: [
      { id: 'woj-1', label: '500 ml Bottle', price: 99, mrp: 119 },
      { id: 'woj-2', label: '1 Litre Bottle', price: 179, mrp: 199, isPopular: true },
      { id: 'woj-3', label: '2 Litre Family Bottle', price: 329, mrp: 379 }
    ]
  },
  {
    id: 'prod-9',
    name: 'Aged English Farmhouse Cheddar',
    brand: 'Wensleydale & Co',
    category: 'dairy-eggs',
    unit: '250g wedge',
    price: 499,
    mrp: 599,
    discountPercent: 18,
    rating: 4.9,
    reviewCount: 142,
    inStock: true,
    stockCount: 28,
    sku: 'FM-DAI-009',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80',
    description: 'Clothbound cheddar cave-aged for 18 months. Intense savory nutty complexity with delicate tyrosine crystals that melt smoothly on the palate.',
    origin: 'Somerset, UK',
    dietary: ['Farm Fresh'],
    nutrition: {
      calories: 115,
      protein: '7g',
      carbs: '0.4g',
      fat: '9.5g',
      fiber: '0g'
    },
    storage: 'Wrap tightly in cheese paper and store in vegetable drawer.',
    isDeal: false,
    featured: false,
    harvestTime: 'Cold-Chain Cut Today 4:15 AM',
    freshnessScore: 98,
    darkStoreName: 'Zepto Dark Store #04',
    deliveryEtaMins: 11,
    recentOrdersCount: 18,
    weightVariants: [
      { id: 'wc-1', label: '200g Portion', price: 399, mrp: 469 },
      { id: 'wc-2', label: '250g Wedge', price: 499, mrp: 599, isPopular: true },
      { id: 'wc-3', label: '500g Block', price: 949, mrp: 1099 }
    ],
    cutOptions: [
      { type: 'whole', label: 'Artisan Wedge (Original Cut)' },
      { type: 'sliced', label: 'Thin Sandwich Deli Slices', extraPrice: 20, description: 'Interleaved with wax paper' },
      { type: 'grated', label: 'Fine Grated Flakes (For Pasta / Melting)', extraPrice: 20, description: 'Freshly grated in sterile room' }
    ]
  },
  {
    id: 'prod-10',
    name: 'Organic California Whole Almonds',
    brand: 'Sun Valley Orchard',
    category: 'snacks',
    unit: '500g resealable pouch',
    price: 699,
    mrp: 799,
    discountPercent: 18,
    rating: 4.8,
    reviewCount: 380,
    inStock: true,
    stockCount: 55,
    sku: 'FM-SNK-010',
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=800&q=80',
    description: 'Slow dry-roasted with light sea salt. High in healthy monounsaturated fats, dietary fiber, magnesium, and natural antioxidant Vitamin E.',
    origin: 'Central Valley, CA',
    dietary: ['Organic', 'Vegan', 'Gluten-Free'],
    nutrition: {
      calories: 165,
      protein: '6g',
      carbs: '6g',
      fat: '14g',
      fiber: '3.5g'
    },
    storage: 'Seal pouch tight in cool cupboard or refrigerate for extended crunch.',
    isDeal: false,
    featured: false,
    harvestTime: 'Slow Roasted Yesterday · Nitrogen Sealed',
    freshnessScore: 97,
    darkStoreName: 'Zepto Dark Store #04',
    deliveryEtaMins: 11,
    recentOrdersCount: 24,
    weightVariants: [
      { id: 'wal-1', label: '250g Snack Pouch', price: 359, mrp: 399 },
      { id: 'wal-2', label: '500g Resealable Pouch', price: 699, mrp: 799, isPopular: true },
      { id: 'wal-3', label: '1 kg Bulk Pantry Bag', price: 1299, mrp: 1499 }
    ],
    cutOptions: [
      { type: 'whole', label: 'Whole Dry-Roasted' },
      { type: 'sliced', label: 'Silvered / Sliced Flakes (For Granola & Baking)', extraPrice: 25, description: 'Evenly blanched & sliced' }
    ]
  },
  {
    id: 'prod-11',
    name: 'Heirloom San Marzano Vine Tomatoes',
    brand: 'Campania Heritage',
    category: 'fruits-veg',
    unit: '500g clustered on vine',
    price: 45,
    mrp: 59,
    discountPercent: 20,
    rating: 4.8,
    reviewCount: 198,
    inStock: true,
    stockCount: 4,
    sku: 'FM-VEG-011',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    description: 'Aromatic elongated plum tomatoes left on the vine until deep ruby red. Sweet pulp with minimal seed cavity, ideal for rich pasta sauces and caprese.',
    origin: 'Campania Valley',
    dietary: ['Farm Fresh', 'Vegan', 'Non-GMO'],
    nutrition: {
      calories: 32,
      protein: '1.5g',
      carbs: '7g',
      fat: '0.4g',
      fiber: '2g'
    },
    storage: 'Never refrigerate unripe tomatoes; keep at room temperature stem-side down.',
    isDeal: false,
    featured: true,
    harvestTime: 'Harvested Today 4:00 AM · Dew Fresh',
    freshnessScore: 100,
    darkStoreName: 'Zepto Dark Store #04',
    deliveryEtaMins: 10,
    recentOrdersCount: 41,
    weightVariants: [
      { id: 'wt-1', label: '250g Cluster', price: 25, mrp: 32 },
      { id: 'wt-2', label: '500g Vine Pack', price: 45, mrp: 59, isPopular: true },
      { id: 'wt-3', label: '1 kg Family Box', price: 85, mrp: 109 }
    ],
    cutOptions: [
      { type: 'whole', label: 'Whole On-The-Vine' },
      { type: 'diced', label: 'Diced Cubes (For Bruschetta / Pasta)', extraPrice: 15, description: 'Seeds strained, clean diced' },
      { type: 'sliced', label: 'Thick Slices (For Sandwiches / Caprese)', extraPrice: 15, description: 'Uniform 5mm medallion cuts' }
    ]
  },
  {
    id: 'prod-12',
    name: 'Plant-Based Lavender Dish Cleanser',
    brand: 'PureHabit Eco',
    category: 'household',
    unit: '500 ml dispenser',
    price: 199,
    mrp: 229,
    discountPercent: 17,
    rating: 4.6,
    reviewCount: 110,
    inStock: true,
    stockCount: 42,
    sku: 'FM-HOU-012',
    image: 'https://images.unsplash.com/photo-1585832770485-e68a5dbfad52?auto=format&fit=crop&w=800&q=80',
    description: 'Concentrated grease-cutting botanical formula infused with natural French lavender essential oils. Biodegradable, phosphate-free, and hypoallergenic.',
    origin: 'Made in USA',
    dietary: ['Vegan'],
    nutrition: undefined,
    storage: 'Store upright at room temperature.',
    isDeal: false,
    featured: false
  }
];

export const INITIAL_ADDRESSES: DeliveryAddress[] = [
  {
    id: 'addr-1',
    title: 'Home',
    recipientName: 'Mohamed Ukkas',
    phone: '+91 98765 43210',
    street: '12, Pondy Bazaar, T. Nagar',
    apartment: 'Near Panagal Park',
    city: 'Chennai, Tamil Nadu',
    pincode: '600017',
    isDefault: true
  },
  {
    id: 'addr-2',
    title: 'Work',
    recipientName: 'Mohamed Ukkas',
    phone: '+91 98765 43210',
    street: '45, Luz Church Road, Mylapore',
    apartment: 'Near Kapaleeshwarar Temple',
    city: 'Chennai, Tamil Nadu',
    pincode: '600004',
    isDefault: false
  }
];

export const COUPONS: Coupon[] = [
  {
    code: 'FRESH30',
    discountType: 'percentage',
    value: 30,
    minSpend: 2400,
    description: '30% off your fresh groceries on orders over INR 2,400 (Max INR 1,440 savings)'
  },
  {
    code: 'WELCOME10',
    discountType: 'fixed',
    value: 960,
    minSpend: 3360,
    description: 'INR 960 instant flat discount on your next supermarket trip over INR 3,360'
  },
  {
    code: 'GREENFREE',
    discountType: 'fixed',
    value: 480,
    minSpend: 1920,
    description: 'INR 480 off green basket essentials'
  }
];

export const ADMIN_USER: User = {
  id: 'usr-admin-mohamed',
  email: 'mohamedukkas.ai@gmail.com',
  firstName: 'Mohamed',
  lastName: 'Ukkas',
  role: 'ADMIN',
  phone: '+91 98765 43210'
};

export const INITIAL_MANAGERS: StoreMember[] = [];

export const INITIAL_STAFF: StoreMember[] = [];

export const INITIAL_STAFF_WORKS: StaffWorkItem[] = [];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'FM10291',
    createdAt: 'Today, 10:24 AM',
    customerName: 'Mohamed Ukkas',
    customerPhone: '+91 98765 43210',
    customerEmail: 'mohamedukkas.ai@gmail.com',
    address: INITIAL_ADDRESSES[0],
    slot: 'Today, 2:00 PM →" 4:00 PM',
    paymentMethod: 'UPI',
    status: 'packing',
    items: [
      {
        productId: 'prod-1',
        name: 'Organic Hass Avocados',
        brand: 'Napa Harvest',
        unit: 'Pack of 3 (approx. 450g)',
        price: 3.49,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80'
      },
      {
        productId: 'prod-2',
        name: 'Farm Fresh Organic Whole Milk',
        brand: 'Clover Meadows',
        unit: '1 Gallon (3.78 L)',
        price: 4.85,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80'
      },
      {
        productId: 'prod-3',
        name: 'Artisan Country Sourdough Loaf',
        brand: 'Stone Mill Bakery',
        unit: '750g whole loaf',
        price: 5.20,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 17.03,
    deliveryFee: 0,
    discount: 5.11,
    total: 11.92,
    deliveryAgent: {
      name: 'Rajesh Kumar',
      phone: '+91 91234 56780',
      vehicle: 'Electric Cargo Scooter #18',
      rating: 4.95,
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      currentLocation: 'Market Dispatch Hub →" Bagging Station 3'
    },
    estimatedDeliveryTime: '38 minutes'
  },
  {
    id: 'FM10284',
    createdAt: 'Yesterday, 4:15 PM',
    customerName: 'Mohamed Ukkas',
    customerPhone: '+91 98765 43210',
    customerEmail: 'mohamedukkas.ai@gmail.com',
    address: INITIAL_ADDRESSES[0],
    slot: 'Yesterday, 5:00 PM →" 7:00 PM',
    paymentMethod: 'Card',
    status: 'delivered',
    items: [
      {
        productId: 'prod-4',
        name: 'Cold-Pressed Extra Virgin Olive Oil',
        brand: 'Terra Antica',
        unit: '750 ml Glass Bottle',
        price: 14.50,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80'
      },
      {
        productId: 'prod-6',
        name: 'Organic Honeycrisp Crisp Apples',
        brand: 'Cascade Orchards',
        unit: '1 kg (approx. 4→"5 apples)',
        price: 4.20,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 22.90,
    deliveryFee: 0,
    discount: 2.29,
    total: 20.61,
    deliveryAgent: {
      name: 'Sara Chen',
      phone: '+91 98765 43211',
      vehicle: 'Delivery Van #04',
      rating: 4.9,
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      currentLocation: 'Delivered to Doorstep with Photo Proof'
    }
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'audit-system-init',
    action: 'SECURITY_LOGIN',
    title: 'Super Admin Access Configured',
    details: 'Mohamed Ukkas (mohamedukkas.ai@gmail.com) authorized as system Super Admin. Authorized to assign Store Managers and Staff by email.',
    actor: 'Security Protocol',
    actorEmail: 'mohamedukkas.ai@gmail.com',
    targetRole: 'ADMIN',
    timestamp: 'System Initialized',
    severity: 'info'
  }
];
