import {Product} from './product';
import {AbstractModel} from './abstract-model';
import {Category} from './category';

export namespace OrderItem {
  export interface Dto {
    id: number;
    product: number | Product.Dto;
    quantity_initial: number;
    quantity_current: number;
  }
}

export class OrderItem extends AbstractModel {
  constructor(
    id: number,
    public product: Product,
    public quantityInitial: number,
    public quantityCurrent: number
  ) {
    super(id);
  }

  static fromDto(dto: OrderItem.Dto, products?: Product[], categories?: Category[]): OrderItem {
    return new OrderItem(
      dto.id,
      typeof(dto.product) === 'number' ?
        products.find((product: Product) => product.id === dto.product) :
        Product.fromDto(dto.product, categories),
      dto.quantity_initial,
      dto.quantity_current
    );
  }

  static cancelDto(newQuantity: number) {
    return {
      id: undefined,
      product: undefined,
      quantity_initial: undefined,
      quantity_current: newQuantity
    };
  }

  toDto(): OrderItem.Dto {
    return {
      id: undefined,
      product: this.product.id,
      quantity_initial: this.quantityInitial,
      quantity_current: undefined
    };
  }

  total(): number {
    return this.product.price * this.quantityCurrent;
  }

  totalInitial(): number {
    return this.product.price * this.quantityInitial;
  }
}
