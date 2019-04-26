import {OrderItem} from './order-item';
import {AbstractModel} from './abstract-model';
import {Guest} from './guest';
import {Product} from './product';
import {formatCurrency} from '../util/format';
import {Category} from './category';

export namespace Order {
  export interface Dto {
    id: number;
    time: string;
    guest: number;
    card: string;
    custom_initial: string;
    custom_current: string;
    pending: boolean;
    items: OrderItem.Dto[];
  }
}

export class Order extends AbstractModel {
  constructor(
    id: number,
    public time: Date,
    public guest: Guest,
    public card: string,
    public customInitial: number,
    public customCurrent: number,
    public pending: boolean,
    public orderItems: OrderItem[]
  ) {
    super(id);
  }

  static fromDto(dto: Order.Dto, guests?: Guest[], products?: Product[], categories?: Category[]) {
    // Order DTOs received via guest card contain full product DTOs, so they are not always required for resolution.
    // Guest IDs on the other hand are only included in the global list endpoint, requiring a full guest list to resolve those.
    return new Order(
      dto.id,
      new Date(dto.time),
      dto.guest ? guests.find((guest: Guest) => guest.id === dto.guest) : undefined,
      dto.card,
      parseFloat(dto.custom_initial),
      parseFloat(dto.custom_current),
      dto.pending,
      dto.items.map((orderItemDto: OrderItem.Dto) => OrderItem.fromDto(orderItemDto, products, categories))
    );
  }

  static commitDto(): Order.Dto {
    return {
      id: undefined,
      time: undefined,
      guest: undefined,
      card: undefined,
      custom_initial: undefined,
      custom_current: undefined,
      pending: false,
      items: undefined
    };
  }

  static cancelDto(newCustom: number): Order.Dto {
    return {
      id: undefined,
      time: undefined,
      guest: undefined,
      card: undefined,
      custom_initial: undefined,
      custom_current: formatCurrency(newCustom),
      pending: undefined,
      items: undefined
    };
  }

  toDto(): Order.Dto {
    return {
      id: undefined,
      time: undefined,
      guest: this.guest ? this.guest.id : undefined,
      card: this.card,
      custom_initial: formatCurrency(this.customInitial),
      custom_current: undefined,
      pending: undefined,
      items: this.orderItems.map((orderItem: OrderItem) => orderItem.toDto())
    };
  }
}
