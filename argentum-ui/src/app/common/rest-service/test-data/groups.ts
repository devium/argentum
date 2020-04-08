import {Group} from '../../model/group';

export namespace Groups {
  export const ADMIN = new Group(14010, 'admin');
  export const ORDER = new Group(14020, 'order');
  export const COAT_CHECK = new Group(14030, 'coat_check');
  export const CHECK_IN = new Group(14040, 'check_in');
  export const TRANSFER = new Group(14050, 'transfer');
  export const SCAN = new Group(14060, 'scan');
  export const PRODUCT_RANGE_ALL = new Group(14070, 'product_range_all');
  export const PRODUCT_RANGE_1 = new Group(14080, 'product_range_13010');
  export const PRODUCT_RANGE_2 = new Group(14090, 'product_range_13020');

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
