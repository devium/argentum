import {OrderItem} from '../../model/order-item';
import {Products} from './products';

export namespace OrderItems {
  export const ONE_WATER = new OrderItem(1, Products.WATER, 1, 1, 0);
  export const TWO_COKES = new OrderItem(2, Products.COKE, 2, 2, 0);

  export const ALL = [ONE_WATER, TWO_COKES];

  export const ONE_WATER2 = new OrderItem(3, Products.WATER, 1, 1, 0);
  export const ONE_COKE = new OrderItem(4, Products.COKE, 1, 1, 0);

  export const ONE_WATER_PATCHED = new OrderItem(1, Products.WATER, 1, 0, 0);
}
