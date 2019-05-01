import {AbstractTimeModel} from './abstract-model';
import {Guest} from './guest';
import {formatCurrency} from '../utils';

export class BonusTransaction extends AbstractTimeModel {
  constructor(
    id: number,
    time: Date,
    public guest: Guest,
    public card: string,
    public value: number,
    public description: string,
    public pending: boolean
  ) {
    super(id, time);
  }

  static fromDto(dto: BonusTransaction.Dto, guests?: Guest[]): BonusTransaction {
    return new BonusTransaction(
      dto.id,
      new Date(dto.time),
      dto.guest ? guests.find((guest: Guest) => guest.id === dto.guest) : undefined,
      dto.card,
      parseFloat(dto.value),
      dto.description,
      dto.pending
    );
  }

  static commitDto(): BonusTransaction.Dto {
    return {
      id: undefined,
      time: undefined,
      guest: undefined,
      card: undefined,
      value: undefined,
      description: undefined,
      pending: false
    };
  }

  static createDto(guest: Guest, value: number): BonusTransaction.Dto {
    return {
      id: undefined,
      time: undefined,
      guest: guest.id,
      card: undefined,
      value: formatCurrency(value),
      description: undefined,
      pending: undefined
    };
  }

  static createCardDto(card: string, value: number): BonusTransaction.Dto {
    return {
      id: undefined,
      time: undefined,
      guest: undefined,
      card: card,
      value: formatCurrency(value),
      description: undefined,
      pending: undefined
    };
  }

  toDto(): BonusTransaction.Dto {
    return {
      id: undefined,
      time: undefined,
      guest: this.guest ? this.guest.id : undefined,
      card: this.card,
      value: formatCurrency(this.value),
      description: this.description,
      pending: undefined
    };
  }
}

export namespace BonusTransaction {
  export class Dto {
    id: number;
    time: string;
    guest: number;
    card: string;
    value: string;
    description: string;
    pending: boolean;
  }
}
