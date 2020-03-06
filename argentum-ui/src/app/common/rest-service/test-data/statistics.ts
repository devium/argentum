import {QuantitySales, Statistics} from '../../model/statistics';
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
    ]
  );
}
