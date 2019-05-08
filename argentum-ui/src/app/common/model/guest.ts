import {AbstractModel} from './abstract-model';
import {formatDate} from '../utils';
import {Status} from './status';

export namespace Guest {
  export interface Filter {
    code?: string;
    name?: string;
    mail?: string;
    status?: number;
  }

  export interface Dto {
    id: number;
    code: string;
    name: string;
    mail: string;
    status: number;
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
    public status: Status,
    public checkedIn: Date,
    public card: string,
    public balance: number,
    public bonus: number
  ) {
    super(id);
  }

  static fromDto(dto: Guest.Dto, statuses: Status[]): Guest {
    return new Guest(
      dto.id,
      dto.code,
      dto.name,
      dto.mail,
      dto.status === undefined ? undefined : dto.status === null ? null : statuses.find((status: Status) => status.id === dto.status),
      dto.checked_in === undefined ? undefined : dto.checked_in === null ? null : new Date(dto.checked_in),
      dto.card,
      parseFloat(dto.balance),
      parseFloat(dto.bonus)
    );
  }

  static checkInDto(): Guest.Dto {
    return {
      id: undefined,
      code: undefined,
      name: undefined,
      mail: undefined,
      status: undefined,
      checked_in: formatDate(new Date()),
      card: undefined,
      balance: undefined,
      bonus: undefined
    };
  }

  static cardDto(card: string): Guest.Dto {
    return {
      id: undefined,
      code: undefined,
      name: undefined,
      mail: undefined,
      status: undefined,
      checked_in: undefined,
      card: card,
      balance: undefined,
      bonus: undefined
    };
  }

  toDto(): Guest.Dto {
    return {
      id: undefined,
      code: this.code,
      name: this.name,
      mail: this.mail,
      status: this.status === undefined ? undefined : this.status === null ? null : this.status.id,
      checked_in: formatDate(this.checkedIn),
      card: this.card,
      balance: undefined,
      bonus: undefined
    };
  }
}
