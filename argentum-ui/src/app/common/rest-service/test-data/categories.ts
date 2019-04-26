import {Category} from '../../model/category';

export namespace Categories {
  export const SOFT_DRINKS = new Category(1, 'Soft drinks', '#00ffff');
  export const HARD_DRINKS = new Category(2, 'Hard drinks', '#ff0000');

  export const ALL = [SOFT_DRINKS, HARD_DRINKS];

  export const SPIRITS = new Category(3, 'Spirits', '#ff00ff');
  export const SOFT_DRINKS_PATCHED = new Category(1, 'Nonalcoholic', undefined);
  export const SOFT_DRINKS_PATCHED_REFERENCE = new Category(1, 'Nonalcoholic', '#00ffff');
}
