import {Product} from '../../model/product';
import {Categories} from './categories';

export namespace Products {
  export const WATER = new Product(1, 'Water', false, 2.40, Categories.SOFT_DRINKS, [1, 2]);
  export const COKE = new Product(2, 'Coke', true, 3.20, null, [2]);

  export const ALL = [WATER, COKE];

  export const BEER_MIN = new Product(undefined, 'Beer', undefined, 3.60, undefined, undefined);
  export const BEER_MIN_REFERENCE = new Product(3, 'Beer', false, 3.60, null, []);
  export const BEER_MAX = new Product(undefined, 'Beer', true, 3.60, Categories.HARD_DRINKS, [2]);
  export const BEER_MAX_REFERENCE = new Product(3, 'Beer', true, 3.60, Categories.HARD_DRINKS, [2]);
  export const WATER_PATCHED = new Product(1, 'Aqua', true, undefined, undefined, [1]);
  export const WATER_PATCHED_REFERENCE = new Product(1, 'Aqua', true, 2.40, Categories.SOFT_DRINKS, [1]);
}
