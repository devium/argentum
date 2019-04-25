import {Product} from '../../model/product';
import {CATEGORY_HARD_DRINKS, CATEGORY_SOFT_DRINKS} from './categories';

export const PRODUCT_WATER = new Product(1, 'Water', false, 2.40, CATEGORY_SOFT_DRINKS, [1, 2]);
export const PRODUCT_COKE = new Product(2, 'Coke', true, 3.20, null, [2]);

export const PRODUCTS_ALL = [PRODUCT_WATER, PRODUCT_COKE];

export const PRODUCT_BEER_MIN = new Product(undefined, 'Beer', undefined, 3.60, undefined, undefined);
export const PRODUCT_BEER_MIN_REFERENCE = new Product(3, 'Beer', false, 3.60, null, []);
export const PRODUCT_BEER_MAX = new Product(undefined, 'Beer', true, 3.60, CATEGORY_HARD_DRINKS, [2]);
export const PRODUCT_BEER_MAX_REFERENCE = new Product(3, 'Beer', true, 3.60, CATEGORY_HARD_DRINKS, [2]);
export const PRODUCT_WATER_PATCHED = new Product(1, 'Aqua', true, undefined, undefined, [1]);
export const PRODUCT_WATER_PATCHED_REFERENCE = new Product(1, 'Aqua', true, 2.40, CATEGORY_SOFT_DRINKS, [1]);
