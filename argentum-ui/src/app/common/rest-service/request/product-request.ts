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
    category: product.category ? product.category.id : null,
    ranges: Array.from(product.ranges.values()).map(range => range.id)
  };
}
