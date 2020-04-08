import {Guest} from '../../model/guest';
import {Statuses} from './statuses';

export namespace Guests {
  export const ROBY = new Guest(
    17010,
    'DEMO-00001',
    'Roby Brushfield',
    'rbrushfield0@sohu.com',
    Statuses.PAID,
    new Date('2019-12-31T22:55:44Z'),
    '567a',
    7.50,
    0.00
  );

  export const SHEELAH = new Guest(
    17020,
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

  export const JOHANNA_MIN_REQUEST = new Guest(
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

  export const JOHANNA_MIN_RESPONSE = new Guest(
    17030,
    'DEMO-00003',
    'Johanna Doe',
    'jdoe2@tinypic.com',
    null,
    null,
    null,
    0.00,
    0.00
  );

  export const JOHANNA_MAX_REQUEST = new Guest(
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

  export const JOHANNA_MAX_RESPONSE = new Guest(
    17031,
    'DEMO-00003',
    'Johanna Doe',
    'jdoe2@tinypic.com',
    Statuses.PAID,
    new Date('2019-12-31T23:13:52Z'),
    '581a',
    0.00,
    0.00
  );

  export const ROBY_PATCHED_REQUEST = new Guest(
    17011,
    undefined,
    undefined,
    undefined,
    undefined,
    new Date('2019-12-31T22:57:30Z'),
    undefined,
    undefined,
    undefined
  );

  export const ROBY_PATCHED_RESPONSE = new Guest(
    17011,
    'DEMO-00001',
    'Roby Brushfield',
    'rbrushfield0@sohu.com',
    Statuses.PAID,
    new Date('2019-12-31T22:57:30Z'),
    '567a',
    7.50,
    0.00
  );

  export const JOHANNA_LIST_CREATED_REQUEST = new Guest(
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

  export const JOHANNA_LIST_CREATED_RESPONSE = new Guest(
    17030,
    'DEMO-00003',
    'Johanna Doe',
    'jdoe2@tinypic.com',
    null,
    null,
    null,
    0.00,
    0.00
  );

  export const ROBY_LIST_PATCHED_REQUEST = new Guest(
    undefined,
    'DEMO-00001',
    'Toby Brushfield',
    'tbrushfield0@sohu.com',
    Statuses.PENDING,
    undefined,
    undefined,
    undefined,
    undefined
  );

  export const ROBY_LIST_PATCHED_RESPONSE = new Guest(
    17012,
    'DEMO-00001',
    'Toby Brushfield',
    'tbrushfield0@sohu.com',
    Statuses.PENDING,
    new Date('2019-12-31T22:55:44Z'),
    '567a',
    7.50,
    0.00
  );
}
