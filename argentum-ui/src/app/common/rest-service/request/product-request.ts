import { Product } from '../../model/product';
export class ProductRequest {
  id: number;
  name: string;
  price: number;
  category: number;
  ranges: number[];
}

export function fromProduct(product: Product) {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.categoryId,
    ranges: Array.from(product.rangeIds.keys())
  };
}
