import {Group} from '../../model/group';

export namespace Groups {
  export const ADMIN = new Group(1, 'admin');
  export const ORDER = new Group(2, 'order');
  export const COAT_CHECK = new Group(3, 'coat_check');
  export const CHECK_IN = new Group(4, 'check_in');
  export const TRANSFER = new Group(5, 'transfer');
  export const SCAN = new Group(6, 'scan');
  export const PRODUCT_RANGE_ALL = new Group(7, 'product_range_all');
  export const PRODUCT_RANGE_1 = new Group(8, 'product_range_1');
  export const PRODUCT_RANGE_2 = new Group(9, 'product_range_2');

  export const ALL = [
    ADMIN,
    ORDER,
    COAT_CHECK,
    CHECK_IN,
    TRANSFER,
    SCAN,
    PRODUCT_RANGE_ALL,
    PRODUCT_RANGE_1,
    PRODUCT_RANGE_2
  ];
}
