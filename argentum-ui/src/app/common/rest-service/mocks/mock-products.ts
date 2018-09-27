import { Product } from '../../model/product';
import { BEV_ALC, BEV_NONALC, CAFFEINE, FOOD_SWEET } from './mock-categories';
import { BAR, BUFFET } from './mock-ranges';

export const WATER: Product = {
  id: 1,
  name: 'Water',
  price: 1.50,
  categoryId: BEV_NONALC.id,
  rangeIds: new Set([BAR.id]),
  legacy: false
};
export const BEER: Product = {
  id: 2,
  name: 'Beer',
  price: 3.50,
  categoryId: BEV_ALC.id,
  rangeIds: new Set([BAR.id]),
  legacy: false
};
export const LONG_DRINK: Product = {
  id: 3,
  name: 'Long Drink',
  price: 6.00,
  categoryId: BEV_ALC.id,
  rangeIds: new Set([BAR.id]),
  legacy: false
};
export const TAP_WATER: Product = {
  id: 4,
  name: 'Tap Water',
  price: 0.50,
  categoryId: BEV_NONALC.id,
  rangeIds: new Set([BAR.id]),
  legacy: false
};
export const COCKTAIL: Product = {
  id: 5,
  name: 'Cocktail',
  price: 7.00,
  categoryId: BEV_ALC.id,
  rangeIds: new Set([BAR.id]),
  legacy: false
};
export const SPRITE: Product = {
  id: 6,
  name: 'Sprite',
  price: 3.20,
  categoryId: BEV_NONALC.id,
  rangeIds: new Set([BAR.id]),
  legacy: false
};
export const COKE: Product = {
  id: 7,
  name: 'Coke',
  price: 3.20,
  categoryId: BEV_NONALC.id,
  rangeIds: new Set([BAR.id]),
  legacy: true
};
export const PEPSI: Product = {
  id: 8,
  name: 'Pepsi',
  price: 3.20,
  categoryId: BEV_NONALC.id,
  rangeIds: new Set([BAR.id]),
  legacy: false
};
export const TEA: Product = {
  id: 9,
  name: 'Tea',
  price: 4.50,
  categoryId: BEV_NONALC.id,
  rangeIds: new Set([BAR.id]),
  legacy: false
};
export const CHAI_LATTE: Product = {
  id: 10,
  name: 'Chai Latte',
  price: 4.50,
  categoryId: BEV_NONALC.id,
  rangeIds: new Set([BAR.id]),
  legacy: false
};
export const COFFEE: Product = {
  id: 11,
  name: 'Coffee',
  price: 4.50,
  categoryId: CAFFEINE.id,
  rangeIds: new Set([BAR.id]),
  legacy: false
};
export const RED_BULL: Product = {
  id: 12,
  name: 'Red Bull',
  price: 2.70,
  categoryId: CAFFEINE.id,
  rangeIds: new Set([BAR.id]),
  legacy: false
};
export const SHOT: Product = {
  id: 13,
  name: 'Shot',
  price: 4.00,
  categoryId: BEV_ALC.id,
  rangeIds: new Set([BAR.id]),
  legacy: false
};
export const CAKE: Product = {
  id: 14,
  name: 'Cake',
  price: 10.00,
  categoryId: FOOD_SWEET.id,
  rangeIds: new Set([BAR.id, BUFFET.id]),
  legacy: false
};
export const TABLE: Product = {
  id: 15,
  name: 'Table',
  price: 30.00,
  categoryId: null,
  rangeIds: new Set(),
  legacy: false
};
export const TABLE2: Product = {
  id: 16,
  name: 'Table',
  price: 25.00,
  categoryId: null,
  rangeIds: new Set(),
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
  TABLE,
  TABLE2
];
