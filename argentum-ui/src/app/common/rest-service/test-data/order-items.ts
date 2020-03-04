import {OrderItem} from '../../model/order-item';
import {Products} from './products';

export namespace OrderItems {
  export const ONE_COAT_CHECK_ITEM_1 = new OrderItem(1, Products.COAT_CHECK_ITEM, 1, 1, 0);
  export const ONE_COAT_CHECK_ITEM_2 = new OrderItem(2, Products.COAT_CHECK_ITEM, 1, 1, 0);
  export const ONE_WATER = new OrderItem(3, Products.WATER, 1, 1, 0);
  export const TWO_COKES = new OrderItem(4, Products.COKE, 2, 2, 0);

  export const ALL = [ONE_COAT_CHECK_ITEM_1, ONE_COAT_CHECK_ITEM_2, ONE_WATER, TWO_COKES];

  export const ONE_WATER2 = new OrderItem(5, Products.WATER, 1, 1, 0);
  export const ONE_COKE = new OrderItem(6, Products.COKE, 1, 1, 0);

  export const ONE_WATER_PATCHED = new OrderItem(3, Products.WATER, 1, 0, 0);
}
