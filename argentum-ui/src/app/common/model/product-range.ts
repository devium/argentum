import {Product, ProductDto} from './product';
import {AbstractModel} from './abstract-model';
import {Category} from './category';

export interface ProductRangeDto {
  id: number;
  name: string;
  products: ProductDto[];
}

export class ProductRange extends AbstractModel {
  constructor(
    id: number,
    public name: string,
    public products: Product[]
  ) {
    super(id);
  }

  static fromDto(dto: ProductRangeDto, categories: Category[]): ProductRange {
    return new ProductRange(
      dto.id,
      dto.name,
      dto.products ? dto.products.map((productDto: ProductDto) => Product.fromDto(productDto, categories)) : undefined
    );
  }

  toDto(): ProductRangeDto {
    return {
      id: undefined,
      name: this.name,
      // Range products are modifiable via the product side of the relationship.
      products: undefined
    };
  }
}
