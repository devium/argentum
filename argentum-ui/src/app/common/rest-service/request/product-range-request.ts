import { ProductRange } from '../../model/product-range';
export class ProductRangeRequest {
  id: number;
  name: string;
}

export function fromProductRange(range: ProductRange): ProductRangeRequest {
  return {
    id: range.id,
    name: range.name
  };
}
