import {Category} from '../../model/category';

export namespace Categories {
  export const COAT_CHECK = new Category(1, 'Coat check', '#ffff00')
  export const SOFT_DRINKS = new Category(2, 'Soft drinks', '#00ffff');
  export const HARD_DRINKS = new Category(3, 'Hard drinks', '#ff0000');

  export const ALL = [COAT_CHECK, SOFT_DRINKS, HARD_DRINKS];

  export const SPIRITS = new Category(4, 'Spirits', '#ff00ff');
  export const SOFT_DRINKS_PATCHED = new Category(2, 'Nonalcoholic', undefined);
  export const SOFT_DRINKS_PATCHED_REFERENCE = new Category(2, 'Nonalcoholic', '#00ffff');
}
