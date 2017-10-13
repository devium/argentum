import { Product } from './product';
import { Guest } from './guest';

export class RawOrder {
  products: Map<Product, number>;
  guest: Guest;
}
