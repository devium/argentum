import {Product} from '../../model/product';
import {Categories} from './categories';

export namespace Products {
  export const COAT_CHECK_ITEM = new Product(12010, 'Coat check item', false, 1.00, Categories.COAT_CHECK, []);
  export const WATER = new Product(12020, 'Water', false, 2.40, Categories.SOFT_DRINKS, [13010, 13020]);
  export const COKE = new Product(12030, 'Coke', true, 3.20, null, [13020]);

  export const ALL = [COAT_CHECK_ITEM, WATER, COKE];

  export const BEER_MIN = new Product(undefined, 'Beer', undefined, 3.60, undefined, undefined);
  export const BEER_MIN_REFERENCE = new Product(12040, 'Beer', false, 3.60, null, []);
  export const BEER_MAX = new Product(undefined, 'Beer', true, 3.60, Categories.HARD_DRINKS, [13020]);
  export const BEER_MAX_REFERENCE = new Product(12041, 'Beer', true, 3.60, Categories.HARD_DRINKS, [13020]);
  export const WATER_DEPRECATED_REFERENCE = new Product(12022, 'Water', true, 2.40, Categories.SOFT_DRINKS, [13010, 13020]);
  export const WATER_PATCHED_REQUEST = new Product(12021, 'Aqua', true, undefined, undefined, [13010]);
  export const WATER_PATCHED_RESPONSE = new Product(12021, 'Aqua', true, 2.40, Categories.SOFT_DRINKS, [13010]);
}
