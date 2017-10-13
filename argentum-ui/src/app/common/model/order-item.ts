import { Product } from './product';

export class OrderItem {
  id: number;
  product: Product;
  quantity: number;
  cancelled: number;
  total: number;
  totalEffective: number;
}
