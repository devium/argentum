import {Tag} from '../../model/tag';

export namespace Tags {
  export const TWO = new Tag(23010, 2);
  export const THREE = new Tag(23020, 3);

  export const ALL = [TWO, THREE];

  export const FOUR = new Tag(23030, 4);
  export const FIVE = new Tag(23040, 5);
}
