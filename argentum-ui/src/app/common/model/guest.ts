import {AbstractModel} from './abstract-model';
import {formatCurrency, formatDate} from '../util/format';

export namespace Guest {
  export interface Filter {
    code?: string;
    name?: string;
    mail?: string;
    status?: string;
  }

  export interface Dto {
    id: number;
    code: string;
    name: string;
    mail: string;
    status: string;
    checked_in: string;
    card: string;
    balance: string;
    bonus: string;
  }
}

export class Guest extends AbstractModel {
  constructor(
    id: number,
    public code: string,
    public name: string,
    public mail: string,
    public status: string,
    public checkedIn: Date,
    public card: string,
    public balance: number,
    public bonus: number
  ) {
    super(id);
  }

  static fromDto(dto: Guest.Dto): Guest {
    return new Guest(
      dto.id,
      dto.code,
      dto.name,
      dto.mail,
      dto.status,
      dto.checked_in === undefined ? undefined : dto.checked_in === null ? null : new Date(dto.checked_in),
      dto.card,
      parseFloat(dto.balance),
      parseFloat(dto.bonus)
    );
  }

  toDto(): Guest.Dto {
    return {
      id: undefined,
      code: this.code,
      name: this.name,
      mail: this.mail,
      status: this.status,
      checked_in: formatDate(this.checkedIn),
      card: this.card,
      balance: undefined,
      bonus: undefined
    };
  }
}
