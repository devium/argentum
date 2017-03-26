import { Category } from '../../model/category';
export class CategoryRequest {
  id: number;
  name: string;
  color: string;
}

export function fromCategory(category: Category): CategoryRequest {
  return {
    id: category.id,
    name: category.name,
    color: category.color
  };
}
