import {Order} from '../../model/order';
import {Guests} from './guests';
import {OrderItems} from './order-items';

export namespace Orders {
  export const ORDER_ONE_WATER_PLUS_TIP = new Order(
    1,
    new Date('2019-12-31T22:10:00Z'),
    Guests.ROBY,
    0.20,
    0.20,
    false,
    [OrderItems.ONE_WATER]
  );
  export const ORDER_TWO_COKES_PLUS_TIP = new Order(
    2,
    new Date('2019-12-31T22:14:00Z'),
    Guests.SHEELAH,
    0.20,
    0.20,
    true,
    [OrderItems.TWO_COKES]
  );

  export const ORDERS_ALL = [ORDER_ONE_WATER_PLUS_TIP, ORDER_TWO_COKES_PLUS_TIP];

  export const ORDER_ONE_WATER_ONE_COKE_PLUS_TIP = new Order(
    3,
    new Date('2019-12-31T22:14:00Z'),
    Guests.SHEELAH,
    0.40,
    0.40,
    true,
    [OrderItems.ONE_WATER2, OrderItems.ONE_COKE]
  );
}
