import {AbstractModel} from './abstract-model';
import {Guest} from './guest';
import {Order} from './order';
import {formatCurrency} from '../util/format';

export class Transaction extends AbstractModel {
  constructor(
    id: number,
    public time: Date,
    public guest: Guest,
    public card: string,
    public value: number,
    public ignoreBonus: boolean,
    public description: string,
    public order: Order,
    public pending: boolean
  ) {
    super(id);
  }

  static fromDto(dto: Transaction.Dto, orders: Order[], guests?: Guest[]): Transaction {
    return new Transaction(
      dto.id,
      new Date(dto.time),
      dto.guest ? guests.find((guest: Guest) => guest.id === dto.guest) : undefined,
      dto.card,
      parseFloat(dto.value),
      dto.ignore_bonus,
      dto.description,
      dto.order === null ? null : dto.order === undefined ? undefined : orders.find((order: Order) => order.id === dto.order),
      dto.pending
    );
  }

  static createDto(card: string, value: number, ignoreBonus: boolean = false) {
    return {
      id: undefined,
      time: undefined,
      guest: undefined,
      card: card,
      value: formatCurrency(value),
      ignore_bonus: ignoreBonus,
      description: undefined,
      order: undefined,
      pending: undefined
    };
  }

  static commitDto() {
    return {
      id: undefined,
      time: undefined,
      guest: undefined,
      card: undefined,
      value: undefined,
      ignore_bonus: undefined,
      description: undefined,
      order: undefined,
      pending: false
    };
  }

  toDto(): Transaction.Dto {
    return {
      id: undefined,
      time: undefined,
      guest: this.guest ? this.guest.id : undefined,
      card: this.card,
      value: formatCurrency(this.value),
      ignore_bonus: this.ignoreBonus,
      description: this.description,
      order: undefined,
      pending: undefined
    };
  }
}

export namespace Transaction {
  export class Dto {
    id: number;
    time: string;
    guest: number;
    card: string;
    value: string;
    ignore_bonus: boolean;
    description: string;
    order: number;
    pending: boolean;
  }
}
