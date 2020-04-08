import {QuantitySales, Statistics, StatTransaction} from '../../model/statistics';
import {Products} from './products';

export namespace TestStatistics {
  export const STATISTICS = new Statistics(
    2,
    1,
    1,
    13.50,
    0.00,
    2.00,
    5.00,
    0.00,
    14.00,
    0.00,
    2,
    1,
    2,
    3,
    [
      new QuantitySales(Products.COAT_CHECK_ITEM, 1, 2.00),
      new QuantitySales(Products.WATER, 1, 2.40),
      new QuantitySales(Products.COKE, 0, 0.00)
    ],
    [new Date('2019-12-31T22:55:44Z')],
    [
      new StatTransaction(new Date('2019-12-31T22:05:00Z'), 9.00),
      new StatTransaction(new Date('2019-12-31T22:07:30Z'), 5.00)
    ],
    [],
    [
      new StatTransaction(new Date('2019-12-31T22:07:00Z'), -1.00),
      new StatTransaction(new Date('2019-12-31T22:09:00Z'), -1.00),
      new StatTransaction(new Date('2019-12-31T22:10:00Z'), -3.00)
    ]
  );
}
