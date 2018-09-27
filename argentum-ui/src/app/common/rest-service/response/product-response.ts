import { Product } from '../../model/product';

export class ProductResponse {
  id: number;
  name: string;
  price: number;
  category: number;
  legacy: boolean;
  ranges: number[];
}

export function toProduct(response: ProductResponse): Product {
  return {
    id: response.id,
    name: response.name,
    price: response.price,
    categoryId: response.category,
    legacy: response.legacy,
    rangeIds: new Set(response.ranges)
  };
}
