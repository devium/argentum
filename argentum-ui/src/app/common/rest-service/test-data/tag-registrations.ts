import {TagRegistration} from '../../model/tag-registration';
import {Tags} from './tags';
import {Orders} from './orders';

export namespace TagRegistrations {
  export const ROBY_TWO = new TagRegistration(
    1,
    new Date('2019-12-31T22:07:01Z'),
    Tags.TWO.label,
    undefined,
    undefined,
    Orders.TAG_REGISTRATION_TWO,
    false
  );

  export const SHEELAH_THREE = new TagRegistration(
    2,
    new Date('2019-12-31T22:09:01Z'),
    Tags.THREE.label,
    undefined,
    undefined,
    Orders.TAG_REGISTRATION_THREE,
    false
  );

  export const ROBY_FOUR = new TagRegistration(
    3,
    new Date('2019-12-31T22:15:01Z'),
    Tags.FOUR.label,
    undefined,
    undefined,
    Orders.TAG_REGISTRATION_FOUR,
    true
  );

  export const ALL = [ROBY_TWO, SHEELAH_THREE];

  export const ROBY_FOUR_COMMITTED_REFERENCE = new TagRegistration(
    3,
    new Date('2019-12-31T22:15:01Z'),
    Tags.FOUR.label,
    undefined,
    undefined,
    Orders.TAG_REGISTRATION_FOUR,
    false
  );

  export const ROBY_FIVE_REFERENCE = new TagRegistration(
    4,
    new Date('2019-12-31T22:19:01Z'),
    Tags.FIVE.label,
    undefined,
    undefined,
    Orders.TAG_REGISTRATION_FIVE,
    true
  );
}
