import {OrderItem} from './order-item';
import {AbstractModel} from './abstract-model';
import {Guest} from './guest';

export namespace Order {
  export interface Dto {
    id: number;
    time: Date;
    guest: number;
    custom_initial: number;
    custom_current: number;
    pending: boolean;
    items: OrderItem.Dto[];
  }
}

export class Order extends AbstractModel {
  constructor(
    id: number,
    public time: Date,
    public guest: Guest,
    public customInitial: number,
    public customCurrent: number,
    public pending: boolean,
    public orderItems: OrderItem[]
  ) {
    super(id);
  }
}
