import {Config} from '../../model/config';

export namespace Configs {
  export const POSTPAID_LIMIT = new Config(10010, 'postpaid_limit', '0.00');

  export const ALL = [POSTPAID_LIMIT];

  export const POSTPAID_LIMIT_PATCHED = new Config(10011, 'postpaid_limit', '10.00');
}
