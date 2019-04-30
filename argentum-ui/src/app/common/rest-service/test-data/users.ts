import {User} from '../../model/user';
import {Groups} from './groups';

export namespace Users {
  export const ADMIN = new User(1, 'admin', '', [
    Groups.ADMIN, Groups.ORDER, Groups.COAT_CHECK, Groups.CHECK_IN, Groups.TRANSFER, Groups.SCAN, Groups.PRODUCT_RANGE_ALL
  ]);
  export const BAR = new User(2, 'bar', '', [Groups.ORDER, Groups.PRODUCT_RANGE_1]);
  export const WARDROBE = new User(3, 'wardrobe', '', [Groups.COAT_CHECK]);
  export const RECEPTION = new User(4, 'reception', '', [Groups.CHECK_IN]);
  export const TOPUP = new User(5, 'topup', '', [Groups.TRANSFER]);
  export const TERMINAL = new User(6, 'terminal', '', [Groups.SCAN]);

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
