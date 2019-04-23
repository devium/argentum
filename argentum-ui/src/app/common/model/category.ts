import {AbstractModel} from './abstract-model';

export interface CategoryDto {
  id: number;
  name: string;
  color: string;
}

export class Category extends AbstractModel {
  constructor(
    id: number,
    public name: string,
    public color: string
  ) {
    super(id);
  }

  static fromDto(dto: CategoryDto): Category {
    return new Category(
      dto.id,
      dto.name,
      dto.color
    );
  }

  toDto(): CategoryDto {
    return {
      id: undefined,
      name: this.name,
      color: this.color
    };
  }
}
