import {AbstractModel} from './abstract-model';
import {Category} from './category';
import {format_currency} from '../util/currency';

export interface ProductDto {
  id: number;
  name: string;
  deprecated: boolean;
  price: string;
  category: number;
  product_ranges: number[];
}

export class Product extends AbstractModel {
  id: number;

  constructor(
    id: number,
    public name: string,
    public deprecated: boolean,
    public price: number,
    public category: Category,
    public product_range_ids: number[]
  ) {
    super(id);
  }

  static fromDto(dto: ProductDto, categories: Category[]) {
    const category = categories.find((categoryDep: Category) => categoryDep.id === dto.category);
    return new Product(
      dto.id,
      dto.name,
      dto.deprecated,
      parseFloat(dto.price),
      category ? category : null,
      dto.product_ranges
    );
  }

  toDto(): ProductDto {
    return {
      id: undefined,
      name: this.name,
      deprecated: this.deprecated,
      price: format_currency(this.price),
      category: this.category ? this.category.id : this.category === undefined ? undefined : null,
      product_ranges: this.product_range_ids
    };
  }
}
