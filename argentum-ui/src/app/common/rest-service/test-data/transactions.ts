import {Transaction} from '../../model/transaction';
import {Guests} from './guests';
import {Orders} from './orders';

export namespace Transactions {
  export const TX1 = new Transaction(
    20010,
    new Date('2019-12-31T22:05:00Z'),
    Guests.ROBY,
    undefined,
    9.00,
    false,
    'default',
    null,
    false
  );

  export const TX_COAT_CHECK_1 = new Transaction(
    20020,
    new Date('2019-12-31T22:07:00Z'),
    Guests.ROBY,
    undefined,
    -1.00,
    false,
    'order',
    Orders.TAG_REGISTRATION_TWO,
    false
  );

  export const TX2 = new Transaction(
    20030,
    new Date('2019-12-31T22:07:30Z'),
    Guests.SHEELAH,
    undefined,
    5.00,
    true,
    'default',
    null,
    false
  );

  export const TX_COAT_CHECK_2 = new Transaction(
    20040,
    new Date('2019-12-31T22:09:00Z'),
    Guests.SHEELAH,
    undefined,
    -1.00,
    false,
    'order',
    Orders.TAG_REGISTRATION_THREE,
    false
  );

  export const TX_ORDER_1 = new Transaction(
    20050,
    new Date('2019-12-31T22:10:00Z'),
    Guests.ROBY,
    undefined,
    -3.00,
    false,
    'order',
    Orders.ONE_WATER_PLUS_TIP,
    false
  );

  export const TX3 = new Transaction(
    20060,
    new Date('2019-12-31T22:30:00Z'),
    Guests.SHEELAH,
    undefined,
    -5.00,
    false,
    'default',
    null,
    true
  );

  export const ALL = [TX1, TX_COAT_CHECK_1, TX2, TX_COAT_CHECK_2, TX_ORDER_1, TX3];

  export const TX1_BY_CARD = new Transaction(
    20010,
    new Date('2019-12-31T22:05:00Z'),
    undefined,
    undefined,
    9.00,
    false,
    'default',
    null,
    false
  );

  export const TX_COAT_CHECK_1_BY_CARD = new Transaction(
    20020,
    new Date('2019-12-31T22:07:00Z'),
    undefined,
    undefined,
    -1.00,
    false,
    'order',
    Orders.TAG_REGISTRATION_TWO,
    false
  );

  export const TX_ORDER_1_BY_CARD = new Transaction(
    20050,
    new Date('2019-12-31T22:10:00Z'),
    undefined,
    undefined,
    -3.00,
    false,
    'order',
    Orders.ONE_WATER_PLUS_TIP,
    false
  );

  export const TX4_REFERENCE = new Transaction(
    20070,
    new Date('2019-12-31T22:35:30Z'),
    undefined,
    undefined,
    5.00,
    false,
    'default',
    null,
    true
  );

  export const TX3_PATCHED_REFERENCE = new Transaction(
    20061,
    new Date('2019-12-31T22:30:05Z'),
    undefined,
    undefined,
    -5.00,
    false,
    'default',
    null,
    false
  );
}
