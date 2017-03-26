import { Product } from '../../model/product';
import { Category } from '../../model/category';

export class ProductResponseMeta {
  id: number;
  name: string;
  price: number;
  category: number;
  legacy: boolean;
}

export function toProductMeta(response: ProductResponseMeta, categories: Category[]): Product {
  return {
    id: response.id,
    name: response.name,
    price: response.price,
    category: categories.find(category => category.id == response.category),
    legacy: response.legacy,
    ranges: null
  };
}
