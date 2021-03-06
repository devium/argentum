import {Order} from '../../model/order';
import {Guests} from './guests';
import {OrderItems} from './order-items';

export namespace Orders {
  export const TAG_REGISTRATION_TWO = new Order(
    18010,
    new Date('2019-12-31T22:07:00Z'),
    Guests.ROBY,
    undefined,
    0.00,
    0.00,
    false,
    [OrderItems.ONE_COAT_CHECK_ITEM_1]
  );

  export const TAG_REGISTRATION_THREE = new Order(
    18020,
    new Date('2019-12-31T22:09:00Z'),
    Guests.SHEELAH,
    undefined,
    0.00,
    0.00,
    false,
    [OrderItems.ONE_COAT_CHECK_ITEM_2]
  );

  export const ONE_WATER_PLUS_TIP = new Order(
    18030,
    new Date('2019-12-31T22:10:00Z'),
    Guests.ROBY,
    undefined,
    0.20,
    0.20,
    false,
    [OrderItems.ONE_WATER]
  );

  export const TWO_COKES_PLUS_TIP = new Order(
    18040,
    new Date('2019-12-31T22:14:00Z'),
    Guests.SHEELAH,
    undefined,
    0.60,
    0.60,
    true,
    [OrderItems.TWO_COKES]
  );

  export const TAG_REGISTRATION_FOUR = new Order(
    18050,
    new Date('2019-12-31T22:15:00Z'),
    Guests.ROBY,
    undefined,
    0.00,
    0.00,
    true,
    [OrderItems.ONE_COAT_CHECK_ITEM_3]
  );

  export const TAG_REGISTRATION_FIVE = new Order(
    18060,
    new Date('2019-12-31T22:19:00Z'),
    Guests.ROBY,
    undefined,
    0.00,
    0.00,
    true,
    [OrderItems.ONE_COAT_CHECK_ITEM_4]
  );

  export const ALL = [
    TAG_REGISTRATION_TWO,
    TAG_REGISTRATION_THREE,
    ONE_WATER_PLUS_TIP,
    TWO_COKES_PLUS_TIP,
    TAG_REGISTRATION_FOUR,
    TAG_REGISTRATION_FIVE
  ];

  export const TAG_REGISTRATION_TWO_BY_CARD = new Order(
    18010,
    new Date('2019-12-31T22:07:00Z'),
    undefined,
    undefined,
    0.00,
    0.00,
    false,
    [OrderItems.ONE_COAT_CHECK_ITEM_1]
  );

  export const ONE_WATER_PLUS_TIP_BY_CARD = new Order(
    18030,
    new Date('2019-12-31T22:10:00Z'),
    undefined,
    undefined,
    0.20,
    0.20,
    false,
    [OrderItems.ONE_WATER]
  );

  export const TAG_REGISTRATION_FOUR_BY_CARD = new Order(
    18050,
    new Date('2019-12-31T22:15:00Z'),
    undefined,
    undefined,
    0.00,
    0.00,
    true,
    [OrderItems.ONE_COAT_CHECK_ITEM_3]
  );

  export const TAG_REGISTRATION_FIVE_BY_CARD = new Order(
    18060,
    new Date('2019-12-31T22:19:00Z'),
    undefined,
    undefined,
    0.00,
    0.00,
    true,
    [OrderItems.ONE_COAT_CHECK_ITEM_4]
  );

  export const ONE_WATER_ONE_COKE_PLUS_TIP = new Order(
    undefined,
    undefined,
    undefined,
    Guests.ROBY.card,
    0.40,
    0.40,
    true,
    [OrderItems.ONE_WATER2, OrderItems.ONE_COKE]
  );

  export const ONE_WATER_ONE_COKE_PLUS_TIP_REFERENCE = new Order(
    18070,
    new Date('2019-12-31T22:17:00Z'),
    undefined,
    undefined,
    0.40,
    0.40,
    true,
    [OrderItems.ONE_WATER2, OrderItems.ONE_COKE]
  );

  export const TWO_COKES_PLUS_TIP_PATCHED_RESPONSE = new Order(
    18041,
    new Date('2019-12-31T22:14:30Z'),
    undefined,
    undefined,
    0.60,
    0.60,
    false,
    [OrderItems.TWO_COKES]
  );

  export const ONE_WATER_PLUS_TIP_PATCHED = new Order(
    18031,
    new Date('2019-12-31T22:10:00Z'),
    undefined,
    undefined,
    0.20,
    0.05,
    false,
    [OrderItems.ONE_WATER]
  );
}
