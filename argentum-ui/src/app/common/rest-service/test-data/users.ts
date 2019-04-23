import {User} from '../../model/user';
import {GROUP_ADMIN, GROUP_CHECK_IN, GROUP_COAT_CHECK, GROUP_ORDER, GROUP_PRODUCT_RANGE_1, GROUP_SCAN, GROUP_TRANSFER} from './groups';

export const USER_ADMIN = new User(1, 'admin', undefined, [GROUP_ADMIN]);
export const USER_BAR = new User(2, 'bar', undefined, [GROUP_ORDER, GROUP_PRODUCT_RANGE_1]);
export const USER_WARDROBE = new User(3, 'wardrobe', undefined, [GROUP_COAT_CHECK]);
export const USER_RECEPTION = new User(4, 'reception', undefined, [GROUP_CHECK_IN]);
export const USER_TOPUP = new User(5, 'topup', undefined, [GROUP_TRANSFER]);
export const USER_TERMINAL = new User(6, 'terminal', undefined, [GROUP_SCAN]);

export const USERS_ALL = [
  USER_ADMIN,
  USER_BAR,
  USER_WARDROBE,
  USER_RECEPTION,
  USER_TOPUP,
  USER_TERMINAL
];

export const USER_BUFFET = new User(7, 'buffet', 'buffet1', [GROUP_ORDER]);
export const USER_WARDROBE_PATCHED = new User(3, 'giftshop', 'giftshop1', [GROUP_ORDER, GROUP_CHECK_IN]);
