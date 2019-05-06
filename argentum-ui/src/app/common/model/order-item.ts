import {Product} from './product';
import {AbstractModel} from './abstract-model';
import {Category} from './category';

export namespace OrderItem {
  export interface Dto {
    id: number;
    product: number | Product.Dto;
    quantity_initial: number;
    quantity_current: number;
    discount: string;
  }
}

export class OrderItem extends AbstractModel {
  constructor(
    id: number,
    public product: Product,
    public quantityInitial: number,
    public quantityCurrent: number,
    public discount: number
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
      dto.quantity_current,
      parseFloat(dto.discount)
    );
  }

  static cancelDto(newQuantity: number): OrderItem.Dto {
    return {
      id: undefined,
      product: undefined,
      quantity_initial: undefined,
      quantity_current: newQuantity,
      discount: undefined
    };
  }

  toDto(): OrderItem.Dto {
    return {
      id: undefined,
      product: this.product.id,
      quantity_initial: this.quantityInitial,
      quantity_current: undefined,
      discount: undefined
    };
  }

  total(): number {
    return this.product.price * this.quantityCurrent * (1 - this.discount);
  }

  totalInitial(): number {
    return this.product.price * this.quantityInitial * (1 - this.discount);
  }
}
