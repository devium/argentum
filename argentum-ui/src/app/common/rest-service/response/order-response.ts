import { OrderItemResponse, toOrderItem } from './order-item-response';
import { GuestResponse } from './guest-response';
import { Order } from '../../model/order';
import { Product } from '../../model/product';
import { OrderItem } from '../../model/order-item';

export class OrderResponse {
  id: number;
  time: number;
  guest: GuestResponse;
  items: OrderItemResponse[];
  total: number;
  customCancelled: number;
}

export function toOrder(response: OrderResponse, products: Map<number, Product>): Order {
  const order =  {
    id: response.id,
    time: new Date(response.time),
    orderItems: response.items.map((orderItemResponse: OrderItemResponse) => toOrderItem(orderItemResponse, products)),
    total: response.total,
    customCancelled: response.customCancelled,
    customTotal: 0,
    customTotalEffective: 0,
    totalEffective: 0,
  };

  order.customTotal = order.total - order.orderItems.map((orderItem: OrderItem) => orderItem.total).reduce(
    (totalA: number, totalB: number) => totalA + totalB, 0
  );
  order.customTotalEffective = order.customTotal - order.customCancelled;
  order.totalEffective = order.customTotalEffective + order.orderItems.map(
    (orderItem: OrderItem) => orderItem.totalEffective
  ).reduce((totalA: number, totalB: number) => totalA + totalB, 0);

  return order;
}
