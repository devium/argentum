import { Product } from './product';
import { Guest } from './guest';

export class Order {
  products: Map<Product, number>;
  guest: Guest;
}
