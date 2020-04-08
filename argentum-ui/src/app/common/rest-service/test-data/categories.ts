import {Category} from '../../model/category';

export namespace Categories {
  export const COAT_CHECK = new Category(11010, 'Coat check', '#ffff00')
  export const SOFT_DRINKS = new Category(11020, 'Soft drinks', '#00ffff');
  export const HARD_DRINKS = new Category(11030, 'Hard drinks', '#ff0000');

  export const ALL = [COAT_CHECK, SOFT_DRINKS, HARD_DRINKS];

  export const SPIRITS = new Category(11040, 'Spirits', '#ff00ff');
  export const SOFT_DRINKS_PATCHED_REQUEST = new Category(11021, 'Nonalcoholic', undefined);
  export const SOFT_DRINKS_PATCHED_RESPONSE = new Category(11021, 'Nonalcoholic', '#00ffff');
}
