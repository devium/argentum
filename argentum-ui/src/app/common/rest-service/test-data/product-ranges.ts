import {ProductRange} from '../../model/product-range';
import {PRODUCT_WATER} from './products';

export const PRODUCT_RANGE_JUST_WATER_META = new ProductRange(1, 'Just water', undefined);
export const PRODUCT_RANGE_JUST_WATER = new ProductRange(1, 'Just water', [PRODUCT_WATER]);
export const PRODUCT_RANGE_EVERYTHING_META = new ProductRange(2, 'Everything', undefined);

export const PRODUCT_RANGES_ALL_META = [PRODUCT_RANGE_JUST_WATER_META, PRODUCT_RANGE_EVERYTHING_META];

export const PRODUCT_RANGE_JUST_COKE_META = new ProductRange(3, 'Just coke', undefined);
export const PRODUCT_RANGE_JUST_WATER_PATCHED_META = new ProductRange(1, 'Just aqua', undefined);
