import {Order} from '../../model/order';
import {Guests} from './guests';
import {OrderItems} from './order-items';

export namespace Orders {
  export const TAG_REGISTRATION_TWO = new Order(
    1,
    new Date('2019-12-31T22:07:00Z'),
    Guests.ROBY,
    undefined,
    0.00,
    0.00,
    false,
    [OrderItems.ONE_COAT_CHECK_ITEM_1]
  );

  export const TAG_REGISTRATION_THREE = new Order(
    2,
    new Date('2019-12-31T22:09:00Z'),
    Guests.SHEELAH,
    undefined,
    0.00,
    0.00,
    false,
    [OrderItems.ONE_COAT_CHECK_ITEM_2]
  );

  export const ONE_WATER_PLUS_TIP = new Order(
    3,
    new Date('2019-12-31T22:10:00Z'),
    Guests.ROBY,
    undefined,
    0.20,
    0.20,
    false,
    [OrderItems.ONE_WATER]
  );

  export const TWO_COKES_PLUS_TIP = new Order(
    4,
    new Date('2019-12-31T22:14:00Z'),
    Guests.SHEELAH,
    undefined,
    0.60,
    0.60,
    true,
    [OrderItems.TWO_COKES]
  );

  export const ALL = [TAG_REGISTRATION_TWO, TAG_REGISTRATION_THREE, ONE_WATER_PLUS_TIP, TWO_COKES_PLUS_TIP];

  export const TAG_REGISTRATION_TWO_BY_CARD = new Order(
    1,
    new Date('2019-12-31T22:07:00Z'),
    undefined,
    undefined,
    0.00,
    0.00,
    false,
    [OrderItems.ONE_COAT_CHECK_ITEM_1]
  );

  export const ONE_WATER_PLUS_TIP_BY_CARD = new Order(
    3,
    new Date('2019-12-31T22:10:00Z'),
    undefined,
    undefined,
    0.20,
    0.20,
    false,
    [OrderItems.ONE_WATER]
  );

  export const ONE_WATER_ONE_COKE_PLUS_TIP = new Order(
    5,
    undefined,
    undefined,
    Guests.ROBY.card,
    0.40,
    0.40,
    true,
    [OrderItems.ONE_WATER2, OrderItems.ONE_COKE]
  );

  export const ONE_WATER_ONE_COKE_PLUS_TIP_REFERENCE = new Order(
    5,
    new Date('2019-12-31T22:17:00Z'),
    undefined,
    undefined,
    0.40,
    0.40,
    true,
    [OrderItems.ONE_WATER2, OrderItems.ONE_COKE]
  );

  export const TWO_COKES_PLUS_TIP_PATCHED_REFERENCE = new Order(
    4,
    new Date('2019-12-31T22:14:30Z'),
    undefined,
    undefined,
    0.60,
    0.60,
    false,
    [OrderItems.TWO_COKES]
  );

  export const ONE_WATER_PLUS_TIP_PATCHED = new Order(
    3,
    new Date('2019-12-31T22:10:00Z'),
    undefined,
    undefined,
    0.20,
    0.05,
    false,
    [OrderItems.ONE_WATER]
  );
}
