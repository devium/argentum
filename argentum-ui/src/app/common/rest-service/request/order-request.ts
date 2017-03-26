import { Order } from '../../model/order';
import { fromOrderItem, OrderItemRequest } from './order-item-request';
export class OrderRequest {
  guestId: number;
  items: OrderItemRequest[];
}

export function fromOrder(order: Order): OrderRequest {
  return {
    guestId: order.guest.id,
    items: Array.from(order.products.entries()).map(item => fromOrderItem(item))
  };
}
