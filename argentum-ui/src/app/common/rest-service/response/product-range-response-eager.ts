import { ProductResponseMeta, toProductMeta } from './product-response-meta';
import { Category } from '../../model/category';
import { ProductRange } from '../../model/product-range';

export class ProductRangeResponseEager {
  id: number;
  name: string;
  products: ProductResponseMeta[];
}

export function toProductRangeEager(response: ProductRangeResponseEager, categories: Category[]): ProductRange {
  return {
    id: response.id,
    name: response.name,
    products: response.products.map(product => toProductMeta(product, categories))
  };
}
