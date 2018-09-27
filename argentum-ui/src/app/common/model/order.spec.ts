import { OrderItem } from './order-item';
import { CAKE, TAP_WATER } from '../rest-service/mocks/mock-products';
import { Order } from './order';

describe('Order', () => {
  it('should create and validate valid redundant values', () => {
    const orderItems = [
      new OrderItem(4, TAP_WATER, 3, 1),
      new OrderItem(5, CAKE, 1, 0)
    ];
    const order = new Order(3, new Date(2018, 11, 31, 22, 30), orderItems, 16.00, 0.75);

    expect(order.id).toBe(3);
    expect(order.time).toEqual(new Date(2018, 11, 31, 22, 30));
    expect(order.orderItems).toEqual(orderItems);
    expect(order.customCancelled).toBe(0.75);
    expect(order.customTotal).toBe(4.50);
    expect(order.customTotalEffective).toBe(3.75);
    expect(order.totalEffective).toBe(14.75);
    expect(order.validate()).toBeTruthy();

    order.customTotal = 5.70;
    expect(order.validate()).toBeFalsy();

    order.customTotal = 4.50;
    order.customTotalEffective = 4.00;
    expect(order.validate()).toBeFalsy();

    order.customTotalEffective = 3.75;
    order.totalEffective = 15.00;
    expect(order.validate()).toBeFalsy();

    order.totalEffective = 14.75;
    expect(order.validate()).toBeTruthy();

    order.orderItems[0].total = 1.60;
    expect(order.validate()).toBeFalsy();
  });
});
