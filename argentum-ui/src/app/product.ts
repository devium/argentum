import { Category } from './category';
import { ProductRange } from './product-range';

export class Product {
  id: number;
  name: string;
  price: number;
  category: Category;
  ranges: Set<ProductRange>;
}
