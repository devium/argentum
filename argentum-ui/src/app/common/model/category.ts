import {AbstractModel} from './abstract-model';


export namespace Category {
  export interface Dto {
    id: number;
    name: string;
    color: string;
  }
}

export class Category extends AbstractModel {
  constructor(
    id: number,
    public name: string,
    public color: string
  ) {
    super(id);
  }

  static fromDto(dto: Category.Dto): Category {
    return new Category(
      dto.id,
      dto.name,
      dto.color
    );
  }

  toDto(): Category.Dto {
    return {
      id: undefined,
      name: this.name,
      color: this.color
    };
  }
}
