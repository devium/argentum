import { ProductRange } from '../../model/product-range';
export class ProductRangeResponse {
  id: number;
  name: string;
}

export function toProductRange(response: ProductRangeResponse): ProductRange {
  return {
    id: response.id,
    name: response.name,
  };
}
