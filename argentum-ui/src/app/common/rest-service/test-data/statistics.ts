import {QuantitySales, Statistics} from '../../model/statistics';
import {Products} from './products';

export namespace TestStatistics {
  export const STATISTICS = new Statistics(
    2,
    1,
    1,
    11.50,
    0.00,
    2.00,
    3.00,
    0.00,
    15.00,
    0.00,
    1,
    1,
    2,
    2,
    [new QuantitySales(Products.WATER, 1, 2.40), new QuantitySales(Products.COKE, 0, 0.00)]
  );
}
