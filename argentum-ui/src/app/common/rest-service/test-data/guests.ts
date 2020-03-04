import {Guest} from '../../model/guest';
import {Statuses} from './statuses';

export namespace Guests {
  export const ROBY = new Guest(
    1,
    'DEMO-00001',
    'Roby Brushfield',
    'rbrushfield0@sohu.com',
    Statuses.PAID,
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
    Statuses.PENDING,
    null,
    null,
    6.00,
    2.00
  );

  export const ALL = [ROBY, SHEELAH];

  export const JOHANNA_MIN = new Guest(
    undefined,
    'DEMO-00003',
    'Johanna Doe',
    'jdoe2@tinypic.com',
    undefined,
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
    null,
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
    Statuses.PAID,
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
    Statuses.PAID,
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
    Statuses.PAID,
    new Date('2019-12-31T22:57:30Z'),
    '567a',
    4.50,
    0.00
  );

  export const JOHANNA_LIST_CREATED = new Guest(
    undefined,
    'DEMO-00003',
    'Johanna Doe',
    'jdoe2@tinypic.com',
    Statuses.PAID,
    undefined,
    undefined,
    undefined,
    undefined
  );

  export const JOHANNA_LIST_CREATED_REFERENCE = new Guest(
    3,
    'DEMO-00003',
    'Johanna Doe',
    'jdoe2@tinypic.com',
    Statuses.PAID,
    null,
    null,
    0.00,
    0.00
  );

  export const ROBY_LIST_PATCHED = new Guest(
    undefined,
    'DEMO-00001',
    'Toby Brushfield',
    'tbrushfield0@sohu.com',
    Statuses.PAID,
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
    Statuses.PAID,
    new Date('2019-12-31T22:55:44Z'),
    '567a',
    4.50,
    0.00
  );
}
