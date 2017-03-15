import { Product } from "../product";
import { Category } from "../category";
import { ProductRange } from "../product-range";
import { Guest } from "../guest";

// Categories
export const BEV_ALC: Category = { id: 1, name: 'Alcoholic', color: '#aaaaee' };
export const BEV_NONALC: Category = { id: 2, name: 'Non-alcoholic', color: '#aaeeaa' };
export const FOOD_SWEET: Category = { id: 3, name: 'Sweets', color: '#eeaaee' };
export const CAFFEINE: Category = { id: 4, name: 'Caffeinated', color: '#883333' };

export const CATEGORIES: Category[] = [
  BEV_ALC,
  BEV_NONALC,
  FOOD_SWEET,
  CAFFEINE
];


// Products.
export const WATER: Product = {
  id: 1,
  name: "Water",
  price: 1.50,
  category: BEV_NONALC,
  ranges: new Set(),
  legacy: false
};
export const BEER: Product = {
  id: 2,
  name: "Beer",
  price: 3.50,
  category: BEV_ALC,
  ranges: new Set(),
  legacy: false
};
export const LONG_DRINK: Product = {
  id: 3,
  name: "Long Drink",
  price: 6.00,
  category: BEV_ALC,
  ranges: new Set(),
  legacy: false
};
export const TAP_WATER: Product = {
  id: 4,
  name: "Tap Water",
  price: 0.50,
  category: BEV_NONALC,
  ranges: new Set(),
  legacy: false
};
export const COCKTAIL: Product = {
  id: 5,
  name: "Cocktail",
  price: 7.00,
  category: BEV_ALC,
  ranges: new Set(),
  legacy: false
};
export const SPRITE: Product = {
  id: 6,
  name: "Sprite",
  price: 3.20,
  category: BEV_NONALC,
  ranges: new Set(),
  legacy: false
};
export const COKE: Product = {
  id: 7,
  name: "Coke",
  price: 3.20,
  category: BEV_NONALC,
  ranges: new Set(),
  legacy: false
};
export const PEPSI: Product = {
  id: 8,
  name: "Pepsi",
  price: 3.20,
  category: BEV_NONALC,
  ranges: new Set(),
  legacy: false
};
export const TEA: Product = {
  id: 9,
  name: "Tea",
  price: 4.50,
  category: BEV_NONALC,
  ranges: new Set(),
  legacy: false
};
export const CHAI_LATTE: Product = {
  id: 10,
  name: "Chai Latte",
  price: 4.50,
  category: BEV_NONALC,
  ranges: new Set(),
  legacy: false
};
export const COFFEE: Product = {
  id: 11,
  name: "Coffee",
  price: 4.50,
  category: CAFFEINE,
  ranges: new Set(),
  legacy: false
};
export const RED_BULL: Product = {
  id: 12,
  name: "Red Bull",
  price: 2.70,
  category: CAFFEINE,
  ranges: new Set(),
  legacy: false
};
export const SHOT: Product = {
  id: 13,
  name: "Shot",
  price: 4.00,
  category: BEV_ALC,
  ranges: new Set(),
  legacy: false
};
export const CAKE: Product = {
  id: 14,
  name: "Cake",
  price: 10.00,
  category: FOOD_SWEET,
  ranges: new Set(),
  legacy: false
};
export const TABLE: Product = {
  id: 15,
  name: "Table",
  price: 30.00,
  category: null,
  ranges: new Set(),
  legacy: false
};

export const PRODUCTS: Product[] = [
  WATER,
  BEER,
  LONG_DRINK,
  TAP_WATER,
  COCKTAIL,
  SPRITE,
  COKE,
  PEPSI,
  TEA,
  CHAI_LATTE,
  COFFEE,
  RED_BULL,
  SHOT,
  CAKE,
  TABLE
];


// Product ranges.
export const BAR: ProductRange = {
  id: 1, name: 'Bar', products: [
    WATER,
    BEER,
    LONG_DRINK,
    TAP_WATER,
    COCKTAIL,
    SPRITE,
    COKE,
    PEPSI,
    TEA,
    CHAI_LATTE,
    COFFEE,
    RED_BULL,
    SHOT,
    CAKE
  ]
};
export const BUFFET: ProductRange = {
  id: 2, name: 'Buffet', products: [
    CAKE
  ]
};
export const COATCHECK: ProductRange = {
  id: 3, name: 'Coat check', products: []
};
export const RECEPTION: ProductRange = {
  id: 4, name: 'Reception', products: []
};

export const PRODUCT_RANGES: ProductRange[] = [BAR, BUFFET, COATCHECK, RECEPTION];


// Back references.
PRODUCT_RANGES.forEach(range => range.products.forEach(product => product.ranges.add(range)));


// Guests
export const JAMES: Guest = {
  id: 1,
  code: 'C-VVJAMES',
  name: 'James the Sunderer',
  mail: 'jimmy@cherpcherp.com',
  card: '12341234',
  balance: 10,
  bonus: 5
};
export const NORBERT: Guest = {
  id: 1,
  code: 'C-VVNORB',
  name: 'Norbert the Waterbear',
  mail: 'norby@smellywaterbear.com',
  card: '11111111',
  balance: 7.60,
  bonus: 0
};

export const GUESTS: Guest[] = [JAMES, NORBERT];
