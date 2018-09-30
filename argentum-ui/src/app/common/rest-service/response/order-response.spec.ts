import { CAKE, PRODUCTS, TAP_WATER } from '../mocks/mock-products';
import { OrderItemResponse } from './order-item-response';
import { OrderResponse, toOrder } from './order-response';
import { Product } from '../../model/product';

describe('OrderResponse', () => {
  it('should produce valid redundant convenience values for the internal model', () => {
    const orderItemsResponse: OrderItemResponse[] = [
      {
        id: 3,
        product: TAP_WATER.id,
        quantity: 3,
        cancelled: 1
      },
      {
        id: 4,
        product: CAKE.id,
        quantity: 1,
        cancelled: 0
      }
    ];
    // item total: 3 tap water + 1 cake = 11.50
    // custom: 3.50
    // total: 16.00
    // cancelled tap water: 1
    // cancelled custom: 0.75
    // effective total: 14.75

    const orderResponse: OrderResponse = {
      id: 2,
      time: new Date(2018, 11, 31, 23, 0).getTime(),
      items: orderItemsResponse,
      total: 16.00,
      customCancelled: 0.75
    };

    const productsMap = new Map<number, Product>(PRODUCTS.map(
      (product: Product) => [product.id, product] as [number, Product]
    ));
    const order = toOrder(orderResponse, productsMap);

    expect(order.id).toBe(2);
    expect(order.time).toEqual(new Date(2018, 11, 31, 23, 0));
    expect(order.total).toBe(16.00);
    expect(order.totalEffective).toBe(14.75);
    expect(order.customTotal).toBe(4.50);
    expect(order.customCancelled).toBe(0.75);
    expect(order.customTotalEffective).toBe(3.75);
    expect(order.orderItems[0].id).toBe(3);
    expect(order.orderItems[0].product).toBe(TAP_WATER);
    expect(order.orderItems[0].quantity).toBe(3);
    expect(order.orderItems[0].cancelled).toBe(1);
    expect(order.orderItems[1].id).toBe(4);
    expect(order.orderItems[1].product).toBe(CAKE);
    expect(order.orderItems[1].quantity).toBe(1);
    expect(order.orderItems[1].cancelled).toBe(0);
    expect(order.validate()).toBeTruthy();
  });
});
