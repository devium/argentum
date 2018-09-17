import { OrderItemResponse, toOrderItem } from './order-item-response';
import { GuestResponse } from './guest-response';
import { Order } from '../../model/order';
import { Product } from '../../model/product';

export class OrderResponse {
  id: number;
  time: number;
  guest: GuestResponse;
  items: OrderItemResponse[];
  total: number;
  customCancelled: number;
}

export function toOrder(response: OrderResponse, products: Map<number, Product>): Order {
  return new Order(
    response.id,
    new Date(response.time),
    response.items.map((orderItemResponse: OrderItemResponse) => toOrderItem(orderItemResponse, products)),
    response.total,
    response.customCancelled
  );
}
