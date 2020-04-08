import {Discount} from '../../model/discount';
import {Statuses} from './statuses';
import {Categories} from './categories';

export namespace Discounts {
  export const PAID_SOFT_DRINKS = new Discount(22010, Statuses.PAID, Categories.SOFT_DRINKS, 0.10);
  export const PENDING_HARD_DRINKS = new Discount(22020, Statuses.PENDING, Categories.HARD_DRINKS, 0.25);

  export const ALL = [PAID_SOFT_DRINKS, PENDING_HARD_DRINKS];

  export const PENDING_SOFT_DRINKS = new Discount(22030, Statuses.PENDING, Categories.SOFT_DRINKS, 0.20);
  export const PAID_SOFT_DRINKS_PATCHED_REQUEST = new Discount(22010, undefined, undefined, 0.40);
  export const PAID_SOFT_DRINKS_PATCHED_RESPONSE = new Discount(22011, Statuses.PAID, Categories.SOFT_DRINKS, 0.40);
}
