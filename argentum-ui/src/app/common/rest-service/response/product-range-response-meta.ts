import { ProductRange } from '../../model/product-range';
export class ProductRangeResponseMeta {
  id: number;
  name: string;
}

export function toProductRangeMeta(response: ProductRangeResponseMeta): ProductRange {
  return {
    id: response.id,
    name: response.name,
    products: null
  };
}
