import { OrderItem } from '../../model/order-item';
import { Product } from '../../model/product';

export class OrderItemResponse {
  id: number;
  product: number;
  quantity: number;
  cancelled: number;
}

export function toOrderItem(response: OrderItemResponse, products: Map<number, Product>): OrderItem {
  return new OrderItem(
    response.id,
    products[response.product],
    response.quantity,
    response.cancelled
  );
}
