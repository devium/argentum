import {AbstractModel} from './abstract-model';
import {Category} from './category';
import {formatCurrency} from '../util/format';

export namespace Product {
  export interface Dto {
    id: number;
    name: string;
    deprecated: boolean;
    price: string;
    category: number;
    product_ranges: number[];
  }
}

export class Product extends AbstractModel {
  id: number;

  constructor(
    id: number,
    public name: string,
    public deprecated: boolean,
    public price: number,
    public category: Category,
    public productRangeIds: number[]
  ) {
    super(id);
  }

  static fromDto(dto: Product.Dto, categories: Category[]) {
    const category = categories.find((categoryDep: Category) => categoryDep.id === dto.category);
    // Sorting is used to provide a unique representation of a set of references for change detection in editors.
    const productRangesSorted = dto.product_ranges.sort((a: number, b: number) => a - b);
    return new Product(
      dto.id,
      dto.name,
      dto.deprecated,
      parseFloat(dto.price),
      category ? category : null,
      productRangesSorted
    );
  }

  static deprecateDto(): Product.Dto {
    return {
      id: undefined,
      name: undefined,
      deprecated: true,
      price: undefined,
      category: undefined,
      product_ranges: undefined
    };
  }

  toDto(): Product.Dto {
    return {
      id: undefined,
      name: this.name,
      deprecated: this.deprecated,
      price: formatCurrency(this.price),
      category: this.category ? this.category.id : this.category === undefined ? undefined : null,
      product_ranges: this.productRangeIds
    };
  }
}
