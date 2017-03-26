import { Category } from '../../model/category';
export class CategoryResponse {
  id: number;
  name: string;
  color: string;
}

export function toCategory(response: CategoryResponse): Category {
  return { id: response.id, name: response.name, color: response.color };
}
