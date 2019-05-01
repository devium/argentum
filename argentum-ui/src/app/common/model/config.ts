import {AbstractModel} from './abstract-model';
import {formatCurrency} from '../utils';

export namespace Config {
  export interface Dto {
    id: number;
    key: string;
    value: string;
  }
}

export class Config extends AbstractModel {
  constructor(id: number, public key: string, public value: string) {
    super(id);
  }

  static fromDto(dto: Config.Dto): Config {
    return new Config(
      dto.id,
      dto.key,
      dto.value
    );
  }

  toDto(): Config.Dto {
    if (this.key === 'postpaid_limit') {
      this.value = formatCurrency(parseFloat(this.value));
    }
    return {
      id: undefined,
      key: undefined,
      value: this.value
    };
  }
}
