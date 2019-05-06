import {AbstractModel} from './abstract-model';
import {Status} from './status';
import {formatDiscount} from '../utils';
import {Category} from './category';

export class Discount extends AbstractModel {
  constructor(
    id: number,
    public status: Status,
    public category: Category,
    public rate: number
  ) {
    super(id);
  }

  static fromDto(dto: Discount.Dto, statuses: Status[], categories: Category[]): Discount {
    return new Discount(
      dto.id,
      statuses.find((status: Status) => status.id === dto.status),
      categories.find((category: Category) => category.id === dto.category),
      parseFloat(dto.rate)
    );
  }

  toDto(): Discount.Dto {
    return {
      id: undefined,
      status: this.status === undefined ? undefined : this.status === null ? null : this.status.id,
      category: this.category === undefined ? undefined : this.category === null ? null : this.category.id,
      rate: formatDiscount(this.rate)
    };
  }
}

export namespace Discount {
  export interface Dto {
    id: number;
    status: number;
    category: number;
    rate: string;
  }
}
