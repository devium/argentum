import { Product } from '../../model/product';
import { ProductRange } from '../../model/product-range';
import { Category } from '../../model/category';

export class ProductResponse {
  id: number;
  name: string;
  price: number;
  category: number;
  legacy: boolean;
  ranges: number[];
}

export function toProductEager(response: ProductResponse, categories: Category[], ranges: ProductRange[]): Product {
  return {
    id: response.id,
    name: response.name,
    price: response.price,
    category: response.category ? categories.find(category => category.id == response.category) : null,
    legacy: response.legacy,
    ranges: new Set(response.ranges.map(rangeId => ranges.find(range => range.id == rangeId)))
  };
}
