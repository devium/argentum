import { Category } from '../../model/category';

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
