import {Group} from '../../model/group';

export const GROUP_ADMIN = new Group(1, 'admin');
export const GROUP_ORDER = new Group(2, 'order');
export const GROUP_COAT_CHECK = new Group(3, 'coat_check');
export const GROUP_CHECK_IN = new Group(4, 'check_in');
export const GROUP_TRANSFER = new Group(5, 'transfer');
export const GROUP_SCAN = new Group(6, 'scan');
export const GROUP_PRODUCT_RANGE_ALL = new Group(7, 'product_range_all');
export const GROUP_PRODUCT_RANGE_1 = new Group(8, 'product_range_1');
export const GROUP_PRODUCT_RANGE_2 = new Group(9, 'product_range_2');

export const GROUPS_ALL = [
  GROUP_ADMIN,
  GROUP_ORDER,
  GROUP_COAT_CHECK,
  GROUP_CHECK_IN,
  GROUP_TRANSFER,
  GROUP_SCAN,
  GROUP_PRODUCT_RANGE_ALL,
  GROUP_PRODUCT_RANGE_1,
  GROUP_PRODUCT_RANGE_2
];
