import { fromOrderItem, OrderItemRequest } from './order-item-request';
import { Product } from '../../model/product';
import { Guest } from '../../model/guest';
export class OrderRequest {
  guestId: number;
  items: OrderItemRequest[];
  customTotal: number;
}

export function fromItems(guest: Guest, items: Map<Product, number>): OrderRequest {
  return {
    guestId: guest.id,
    items: Array.from(items.entries())
      .filter(item => item[0].id !== -1)
      .map(item => fromOrderItem(item)),
    customTotal: Array.from(items.entries())
      .filter(item => item[0].id === -1)
      .map(item => item[0].price * item[1])
      .reduce((a, b) => a + b, 0)
  };
}
