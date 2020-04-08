import {AbstractTimeModel} from './abstract-model';
import {Order} from './order';
import {Guest} from './guest';

export namespace TagRegistration {
  // DTOs use either guest, card, or neither.
  // Requests mostly use card.
  // Responses use neither.
  export interface Dto {
    id: number;
    time: string;
    labels: number[];
    guest: number;
    card: string;
    order: number;
    pending: boolean;
  }
}

export class TagRegistration extends AbstractTimeModel {
  constructor(
    id: number,
    time: Date,
    public labels: number[],
    public guest: Guest,
    public card: string,
    public order: Order,
    public pending: boolean
  ) {
    super(id, time);
  }

  static fromDto(dto: TagRegistration.Dto, orders: Order[], guests?: Guest[]) {
    // Create and update requests do not return a guest ID since they might have been created using the guest's card.
    return new TagRegistration(
      dto.id,
      new Date(dto.time),
      dto.labels,
      dto.guest ? guests.find((guest: Guest) => guest.id === dto.guest) : undefined,
      dto.card,
      orders.find((order: Order) => order.id === dto.order),
      dto.pending
    );
  }

  static createDto(labels: number[], card: string, order: Order): TagRegistration.Dto {
    return {
      id: undefined,
      time: undefined,
      labels: labels,
      guest: undefined,
      card: card,
      order: order.id,
      pending: undefined
    };
  }

  static commitDto(): TagRegistration.Dto {
    return {
      id: undefined,
      time: undefined,
      labels: undefined,
      guest: undefined,
      card: undefined,
      order: undefined,
      pending: false
    };
  }

  toDto(): TagRegistration.Dto {
    return {
      id: undefined,
      time: undefined,
      labels: this.labels,
      guest: this.guest ? this.guest.id : undefined,
      card: this.card,
      order: this.order.id,
      pending: undefined
    };
  }
}
