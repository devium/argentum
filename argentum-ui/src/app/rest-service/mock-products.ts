import { Product } from '../product';
import { Category } from '../category';
import { ProductRange } from '../product-range';

// Categories
export const BEV_ALC: Category = { id: 1, name: 'Alcoholic', color: '#aaaaee' };
export const BEV_NONALC: Category = { id: 2, name: 'Non-alcoholic', color: '#aaeeaa' };
export const FOOD_SWEET: Category = { id: 3, name: 'Sweets', color: '#eeaaee' };

export const CATEGORIES: Category[] = [
  BEV_ALC,
  BEV_NONALC,
  FOOD_SWEET
];


// Products.
export const WATER: Product = { id: 1, name: "Water", price: 1.50, category: BEV_NONALC, ranges: [] };
export const BEER: Product = { id: 2, name: "Beer", price: 3.50, category: BEV_ALC, ranges: [] };
export const LONG_DRINK: Product = { id: 3, name: "Long Drink", price: 6.00, category: BEV_ALC, ranges: [] };
export const TAP_WATER: Product = { id: 4, name: "Tap Water", price: 0.50, category: BEV_NONALC, ranges: [] };
export const COCKTAIL: Product = { id: 5, name: "Cocktail", price: 7.00, category: BEV_ALC, ranges: [] };
export const SPRITE: Product = { id: 6, name: "Sprite", price: 3.20, category: BEV_NONALC, ranges: [] };
export const COKE: Product = { id: 7, name: "Coke", price: 3.20, category: BEV_NONALC, ranges: [] };
export const PEPSI: Product = { id: 8, name: "Pepsi", price: 3.20, category: BEV_NONALC, ranges: [] };
export const TEA: Product = { id: 9, name: "Tea", price: 4.50, category: BEV_NONALC, ranges: [] };
export const CHAI_LATTE: Product = {
  id: 10,
  name: "Chai Latte",
  price: 4.50,
  category: BEV_NONALC,
  ranges: []
};
export const COFFEE: Product = { id: 11, name: "Coffee", price: 4.50, category: BEV_NONALC, ranges: [] };
export const RED_BULL: Product = { id: 12, name: "Red Bull", price: 2.70, category: BEV_NONALC, ranges: [] };
export const SHOT: Product = { id: 13, name: "Shot", price: 4.00, category: BEV_ALC, ranges: [] };
export const CAKE: Product = { id: 14, name: "Cake", price: 10.00, category: FOOD_SWEET, ranges: [] };

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
  CAKE
];


// Product ranges.
export const BEVERAGES: ProductRange = {
  id: 'bev', name: 'Beverages', products: [
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
    SHOT
  ]
};

export const FOOD: ProductRange = {
  id: 'food', name: 'Food', products: [
    CAKE
  ]
};

export const CLOTHES: ProductRange = {
  id: 'cloth', name: 'Clothes', products: []
};

export const GAMES: ProductRange = {
  id: 'game', name: 'Games', products: []
};

export const TOOLS: ProductRange = {
  id: 'tool', name: 'Tools', products: []
};

export const FURNITURE: ProductRange = {
  id: 'furn', name: 'Furniture', products: []
};

export const PRODUCT_RANGES: ProductRange[] = [BEVERAGES, FOOD, GAMES, TOOLS, FURNITURE];


// Back references.
WATER.ranges = [BEVERAGES];
BEER.ranges = [BEVERAGES];
LONG_DRINK.ranges = [BEVERAGES];
TAP_WATER.ranges = [BEVERAGES];
COCKTAIL.ranges = [BEVERAGES];
SPRITE.ranges = [BEVERAGES];
COKE.ranges = [BEVERAGES];
PEPSI.ranges = [BEVERAGES];
TEA.ranges = [BEVERAGES];
CHAI_LATTE.ranges = [BEVERAGES];
COFFEE.ranges = [BEVERAGES];
RED_BULL.ranges = [BEVERAGES];
SHOT.ranges = [BEVERAGES];
CAKE.ranges = [FOOD];
