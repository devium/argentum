import { Product } from "../product";
import { BEV_NONALC, BEV_ALC, FOOD_SWEET } from "./mock-categories";
import { BEVERAGES, FOOD } from "./mock-product-ranges";

export const WATER: Product = { id: 1, name: "Water", price: 1.50, category: BEV_NONALC, ranges: [BEVERAGES] };
export const BEER: Product = { id: 2, name: "Beer", price: 3.50, category: BEV_ALC, ranges: [BEVERAGES] };
export const LONG_DRINK: Product = { id: 3, name: "Long Drink", price: 6.00, category: BEV_ALC, ranges: [BEVERAGES] };
export const TAP_WATER: Product = { id: 4, name: "Tap Water", price: 0.50, category: BEV_NONALC, ranges: [BEVERAGES] };
export const COCKTAIL: Product = { id: 5, name: "Cocktail", price: 7.00, category: BEV_ALC, ranges: [BEVERAGES] };
export const SPRITE: Product = { id: 6, name: "Sprite", price: 3.20, category: BEV_NONALC, ranges: [BEVERAGES] };
export const COKE: Product = { id: 7, name: "Coke", price: 3.20, category: BEV_NONALC, ranges: [BEVERAGES] };
export const PEPSI: Product = { id: 8, name: "Pepsi", price: 3.20, category: BEV_NONALC, ranges: [BEVERAGES] };
export const TEA: Product = { id: 9, name: "Tea", price: 4.50, category: BEV_NONALC, ranges: [BEVERAGES] };
export const CHAI_LATTE: Product = {
  id: 10,
  name: "Chai Latte",
  price: 4.50,
  category: BEV_NONALC,
  ranges: [BEVERAGES]
};
export const COFFEE: Product = { id: 11, name: "Coffee", price: 4.50, category: BEV_NONALC, ranges: [BEVERAGES] };
export const RED_BULL: Product = { id: 12, name: "Red Bull", price: 2.70, category: BEV_NONALC, ranges: [BEVERAGES] };
export const SHOT: Product = { id: 13, name: "Shot", price: 4.00, category: BEV_ALC, ranges: [BEVERAGES] };
export const CAKE: Product = { id: 14, name: "Cake", price: 10.00, category: FOOD_SWEET, ranges: [FOOD] };

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
