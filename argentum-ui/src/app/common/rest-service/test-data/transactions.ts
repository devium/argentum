import {Transaction} from '../../model/transaction';
import {Guests} from './guests';
import {Orders} from './orders';

export namespace Transactions {
  export const TX1 = new Transaction(
    1,
    new Date('2019-12-31T22:05:00Z'),
    Guests.ROBY,
    undefined,
    5.00,
    false,
    'default',
    null,
    false
  );

  export const TX2 = new Transaction(
    2,
    new Date('2019-12-31T22:07:30Z'),
    Guests.SHEELAH,
    undefined,
    10.00,
    true,
    'default',
    null,
    false
  );

  export const TX_ORDER1 = new Transaction(
    3,
    new Date('2019-12-31T22:10:00Z'),
    Guests.ROBY,
    undefined,
    -3.00,
    false,
    'order',
    Orders.ONE_WATER_PLUS_TIP,
    false
  );

  export const TX4 = new Transaction(
    4,
    new Date('2019-12-31T22:30:00Z'),
    Guests.SHEELAH,
    undefined,
    -5.00,
    false,
    'default',
    null,
    true
  );

  export const ALL = [TX1, TX2, TX_ORDER1, TX4];

  export const TX1_BY_CARD = new Transaction(
    1,
    new Date('2019-12-31T22:05:00Z'),
    undefined,
    undefined,
    5.00,
    false,
    'default',
    null,
    false
  );

  export const TX_ORDER1_BY_CARD = new Transaction(
    3,
    new Date('2019-12-31T22:10:00Z'),
    undefined,
    undefined,
    -3.00,
    false,
    'order',
    Orders.ONE_WATER_PLUS_TIP,
    false
  );

  export const TX5_REFERENCE = new Transaction(
    5,
    new Date('2019-12-31T22:35:30Z'),
    undefined,
    undefined,
    5.00,
    false,
    'default',
    null,
    true
  );

  export const TX4_PATCHED_REFERENCE = new Transaction(
    4,
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
