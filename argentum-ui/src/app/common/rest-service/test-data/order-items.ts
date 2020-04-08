import {OrderItem} from '../../model/order-item';
import {Products} from './products';

export namespace OrderItems {
  export const ONE_COAT_CHECK_ITEM_1 = new OrderItem(19010, Products.COAT_CHECK_ITEM, 1, 1, 0);
  export const ONE_COAT_CHECK_ITEM_2 = new OrderItem(19020, Products.COAT_CHECK_ITEM, 1, 1, 0);
  export const ONE_WATER = new OrderItem(19030, Products.WATER, 1, 1, 0);
  export const TWO_COKES = new OrderItem(19040, Products.COKE, 2, 2, 0);
  export const ONE_COAT_CHECK_ITEM_3 = new OrderItem(19050, Products.COAT_CHECK_ITEM, 1, 1, 0);
  export const ONE_COAT_CHECK_ITEM_4 = new OrderItem(19060, Products.COAT_CHECK_ITEM, 1, 1, 0);

  export const ALL = [
    ONE_COAT_CHECK_ITEM_1,
    ONE_COAT_CHECK_ITEM_2,
    ONE_WATER,
    TWO_COKES,
    ONE_COAT_CHECK_ITEM_3,
    ONE_COAT_CHECK_ITEM_4
  ];

  export const ONE_WATER2 = new OrderItem(19070, Products.WATER, 1, 1, 0);
  export const ONE_COKE = new OrderItem(19080, Products.COKE, 1, 1, 0);

  export const ONE_WATER_PATCHED = new OrderItem(19031, Products.WATER, 1, 0, 0);
}
