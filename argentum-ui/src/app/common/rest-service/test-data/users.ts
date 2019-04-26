import {User} from '../../model/user';
import {Groups} from './groups';

export namespace Users {
  export const ADMIN = new User(1, 'admin', undefined, [Groups.ADMIN]);
  export const BAR = new User(2, 'bar', undefined, [Groups.ORDER, Groups.PRODUCT_RANGE_1]);
  export const WARDROBE = new User(3, 'wardrobe', undefined, [Groups.COAT_CHECK]);
  export const RECEPTION = new User(4, 'reception', undefined, [Groups.CHECK_IN]);
  export const TOPUP = new User(5, 'topup', undefined, [Groups.TRANSFER]);
  export const TERMINAL = new User(6, 'terminal', undefined, [Groups.SCAN]);

  export const ALL = [
    ADMIN,
    BAR,
    WARDROBE,
    RECEPTION,
    TOPUP,
    TERMINAL
  ];

  export const BUFFET = new User(7, 'buffet', 'buffet1', [Groups.ORDER]);
  export const WARDROBE_PATCHED = new User(3, 'giftshop', 'giftshop1', [Groups.ORDER, Groups.CHECK_IN]);
}
