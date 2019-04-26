import {Product} from './product';
import {AbstractModel} from './abstract-model';

export namespace OrderItem {
  export interface Dto {
    id: number;
    product: number;
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
}
