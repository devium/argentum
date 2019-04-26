import {Product} from './product';
import {AbstractModel} from './abstract-model';
import {Category} from './category';

export namespace ProductRange {
  export interface Dto {
    id: number;
    name: string;
    products: Product.Dto[];
  }
}

export class ProductRange extends AbstractModel {
  constructor(
    id: number,
    public name: string,
    public products: Product[]
  ) {
    super(id);
  }

  static fromDto(dto: ProductRange.Dto, categories: Category[]): ProductRange {
    return new ProductRange(
      dto.id,
      dto.name,
      dto.products ? dto.products.map((productDto: Product.Dto) => Product.fromDto(productDto, categories)) : undefined
    );
  }

  toDto(): ProductRange.Dto {
    return {
      id: undefined,
      name: this.name,
      // Range products are modifiable via the product side of the relationship.
      products: undefined
    };
  }
}
