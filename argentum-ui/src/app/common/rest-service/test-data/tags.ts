import {Tag} from '../../model/tag';

export namespace Tags {
  export const TWO = new Tag(1, 2);
  export const THREE = new Tag(2, 3);

  export const ALL = [TWO, THREE];

  export const FOUR = new Tag(3, 4);
  export const FIVE = new Tag(4, 5);
}
