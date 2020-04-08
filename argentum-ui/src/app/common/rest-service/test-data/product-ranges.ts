import {ProductRange} from '../../model/product-range';
import {Products} from './products';

export namespace ProductRanges {
  export const JUST_WATER_META = new ProductRange(13010, 'Just water', undefined);
  export const JUST_WATER = new ProductRange(13010, 'Just water', [Products.WATER]);
  export const EVERYTHING_META = new ProductRange(13020, 'Everything', undefined);
  export const EVERYTHING = new ProductRange(13020, 'Everything', [Products.WATER, Products.COKE]);

  export const ALL_META = [JUST_WATER_META, EVERYTHING_META];
  export const ALL = [JUST_WATER, EVERYTHING];

  export const JUST_COKE_META = new ProductRange(13030, 'Just coke', undefined);
  export const JUST_WATER_PATCHED_META = new ProductRange(13011, 'Just aqua', undefined);
}
