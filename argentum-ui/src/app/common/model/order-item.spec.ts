import { OrderItem } from './order-item';
import { TAP_WATER } from '../rest-service/mock-data';

describe('OrderItem', () => {
  it('should create and validate valid redundant values', () => {
    const orderItem = new OrderItem(4, TAP_WATER, 3, 1);

    expect(orderItem.total).toBe(1.50);
    expect(orderItem.totalEffective).toBe(1.00);
    expect(orderItem.validate()).toBeTruthy();

    orderItem.total = 1.75;
    expect(orderItem.validate()).toBeFalsy();

    orderItem.total = 1.50;
    orderItem.totalEffective = 1.25;
    expect(orderItem.validate()).toBeFalsy();

    orderItem.totalEffective = 1.00;
    expect(orderItem.validate()).toBeTruthy();
  });
});
