import {Guest} from '../../model/guest';

export namespace Guests {
  export const ROBY = new Guest(
    1,
    'DEMO-00001',
    'Roby Brushfield',
    'rbrushfield0@sohu.com',
    'staff',
    new Date('2019-12-31T22:55:44Z'),
    '567a',
    4.50,
    0.00
  );

  export const SHEELAH = new Guest(
    2,
    'DEMO-00002',
    'Sheelah Arnault',
    'sarnault1@tuttocitta.it',
    'pending',
    null,
    null,
    7.00,
    2.00
  );

  export const ALL = [ROBY, SHEELAH];

  export const JOHANNA_MIN = new Guest(
    undefined,
    'DEMO-00003',
    'Johanna Doe',
    'jdoe2@tinypic.com',
    'paid',
    undefined,
    undefined,
    undefined,
    undefined
  );

  export const JOHANNA_MIN_REFERENCE = new Guest(
    3,
    'DEMO-00003',
    'Johanna Doe',
    'jdoe2@tinypic.com',
    'paid',
    null,
    null,
    0.00,
    0.00
  );

  export const JOHANNA_MAX = new Guest(
    undefined,
    'DEMO-00003',
    'Johanna Doe',
    'jdoe2@tinypic.com',
    'paid',
    new Date('2019-12-31T23:13:52Z'),
    '581a',
    undefined,
    undefined
  );

  export const JOHANNA_MAX_REFERENCE = new Guest(
    3,
    'DEMO-00003',
    'Johanna Doe',
    'jdoe2@tinypic.com',
    'paid',
    new Date('2019-12-31T23:13:52Z'),
    '581a',
    0.00,
    0.00
  );

  export const ROBY_PATCHED = new Guest(
    1,
    undefined,
    undefined,
    undefined,
    undefined,
    new Date('2019-12-31T22:57:30Z'),
    undefined,
    undefined,
    undefined
  );

  export const ROBY_PATCHED_REFERENCE = new Guest(
    1,
    'DEMO-00001',
    'Roby Brushfield',
    'rbrushfield0@sohu.com',
    'staff',
    new Date('2019-12-31T22:57:30Z'),
    '567a',
    4.50,
    0.00
  );

  export const ROBY_LIST_PATCHED = new Guest(
    undefined,
    'DEMO-00001',
    'Toby Brushfield',
    'tbrushfield0@sohu.com',
    'paid',
    undefined,
    undefined,
    undefined,
    undefined
  );

  export const ROBY_LIST_PATCHED_REFERENCE = new Guest(
    1,
    'DEMO-00001',
    'Toby Brushfield',
    'tbrushfield0@sohu.com',
    'paid',
    new Date('2019-12-31T22:55:44Z'),
    '567a',
    4.50,
    0.00
  );
}
