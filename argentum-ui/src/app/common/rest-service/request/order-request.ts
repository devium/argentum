import { RawOrder } from '../../model/raw-order';
import { fromOrderItem, OrderItemRequest } from './order-item-request';
export class OrderRequest {
  guestId: number;
  items: OrderItemRequest[];
  customTotal: number;
}

export function fromOrder(order: RawOrder): OrderRequest {
  return {
    guestId: order.guest.id,
    items: Array.from(order.products.entries())
      .filter(item => item[0].id !== -1)
      .map(item => fromOrderItem(item)),
    customTotal: Array.from(order.products.entries())
      .filter(item => item[0].id === -1)
      .map(item => item[0].price * item[1])
      .reduce((a, b) => a + b, 0)
  };
}
