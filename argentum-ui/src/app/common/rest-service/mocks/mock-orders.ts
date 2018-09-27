import { Order } from '../../model/order';
import { COFFEE, COKE, PEPSI } from './mock-products';
import { OrderItem } from '../../model/order-item';

export const ORDERS: Order[] = [
  new Order(
    1,
    new Date(2018, 11, 31, 22, 8),
    [
      new OrderItem(1, COKE, 2, 1),
      new OrderItem(2, PEPSI, 1, 0)
    ],
    10.00,
    0
  ),
  new Order(
    2,
    new Date(2018, 11, 31, 22, 10),
    [
      new OrderItem(3, COFFEE, 1, 0),
    ],
    5.00,
    0
  ),
  new Order(
    3,
    new Date(2018, 11, 31, 22, 15),
    [
    ],
    1.50,
    0.50
  ),
];
