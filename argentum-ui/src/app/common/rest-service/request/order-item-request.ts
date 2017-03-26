import { Product } from '../../model/product';
export class OrderItemRequest {
  productId: number;
  quantity: number;
}

export function fromOrderItem(entry: [Product, number]): OrderItemRequest {
  return {
    productId: entry[0].id,
    quantity: entry[1]
  };
}
