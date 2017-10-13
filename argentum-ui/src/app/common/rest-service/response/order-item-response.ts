import { OrderItem } from '../../model/order-item';
import { Product } from '../../model/product';

export class OrderItemResponse {
  id: number;
  productId: number;
  quantity: number;
  cancelled: number;
}

export function toOrderItem(response: OrderItemResponse, products: Map<number, Product>): OrderItem {
  const orderItem = {
    id: response.id,
    product: products[response.productId],
    quantity: response.quantity,
    cancelled: response.cancelled,
    total: 0,
    totalEffective: 0
  };

  orderItem.total = orderItem.quantity * orderItem.product.price;
  orderItem.totalEffective = (orderItem.quantity - orderItem.cancelled) * orderItem.product.price;

  return orderItem;
}
