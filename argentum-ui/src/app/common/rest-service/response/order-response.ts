import { OrderItemResponse } from './order-item-response';
import { GuestResponse } from './guest-response';

export class OrderResponse {
  id: number;
  guest: GuestResponse;
  items: OrderItemResponse[];
  total: number;
}