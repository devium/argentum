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
    let products: Product[];
    if (dto.products) {
      products = dto.products.map((productDto: Product.Dto) => Product.fromDto(productDto, categories));
      products.sort((a: Product, b: Product) => {
        const aValue = a.category.name ? a.category.name : 'Ω';
        const bValue = b.category.name ? b.category.name : 'Ω';
        if (aValue < bValue) {
          return -1;
        }
        if (aValue > bValue) {
          return 1;
        }
        return 0;
      } );
    }
    return new ProductRange(
      dto.id,
      dto.name,
      products
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
