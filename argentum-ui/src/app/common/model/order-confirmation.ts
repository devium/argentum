import { Product } from './product';
import { Guest } from './guest';

export class OrderConfirmation {
  products: Map<Product, number>;
  total: number;
  guest: Guest;
}
