import {Guests} from './guests';
import {BonusTransaction} from '../../model/bonus_transaction';

export namespace BonusTransactions {
  export const BTX1 = new BonusTransaction(
    1,
    new Date('2019-12-31T22:01:00Z'),
    Guests.ROBY,
    undefined,
    2.50,
    'default',
    false
  );

  export const BTX2 = new BonusTransaction(
    2,
    new Date('2019-12-31T22:02:30Z'),
    Guests.SHEELAH,
    undefined,
    2.00,
    'default',
    false
  );

  export const BTX3 = new BonusTransaction(
    3,
    new Date('2019-12-31T22:03:00Z'),
    Guests.ROBY,
    undefined,
    3.00,
    'default',
    true
  );

  export const ALL = [BTX1, BTX2, BTX3];

  export const BTX1_BY_CARD_REFERENCE = new BonusTransaction(
    1,
    new Date('2019-12-31T22:01:00Z'),
    undefined,
    undefined,
    2.50,
    'default',
    false
  );

  export const BTX3_BY_CARD_REFERENCE = new BonusTransaction(
    3,
    new Date('2019-12-31T22:03:00Z'),
    undefined,
    undefined,
    3.00,
    'default',
    true
  );

  export const BTX4_REFERENCE = new BonusTransaction(
    4,
    new Date('2019-12-31T22:04:20Z'),
    undefined,
    undefined,
    4.00,
    'default',
    true
  );

  export const BTX3_PATCHED_REFERENCE = new BonusTransaction(
    3,
    new Date('2019-12-31T22:03:05Z'),
    undefined,
    undefined,
    3.00,
    'default',
    false
  );
}
