import { OrderItem } from '../../model/order-item';
import { Order } from '../../model/order';

export class CancelOrderItemRequest {
  id: number;
  cancelled: number;
  customCancelled: number;
}

export function cancelFromOrderItem(orderItem: OrderItem): CancelOrderItemRequest {
  return {
    id: orderItem.id,
    cancelled: orderItem.cancelled,
    customCancelled: null
  };
}

export function cancelFromOrder(order: Order): CancelOrderItemRequest {
  return {
    id: order.id,
    cancelled: null,
    customCancelled: order.customCancelled
  };
}
