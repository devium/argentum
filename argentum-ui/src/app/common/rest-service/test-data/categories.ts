import {Category} from '../../model/category';

export const CATEGORY_SOFT_DRINKS = new Category(1, 'Soft drinks', '#00ffff');
export const CATEGORY_HARD_DRINKS = new Category(2, 'Hard drinks', '#ff0000');

export const CATEGORIES_ALL = [CATEGORY_SOFT_DRINKS, CATEGORY_HARD_DRINKS];

export const CATEGORY_SPIRITS = new Category(3, 'Spirits', '#ff00ff');
export const CATEGORY_SOFT_DRINKS_PATCHED = new Category(1, 'Nonalcoholic', undefined);
export const CATEGORY_SOFT_DRINKS_PATCHED_REFERENCE = new Category(1, 'Nonalcoholic', '#00ffff');
