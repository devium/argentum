import {AbstractModel} from './abstract-model';

export namespace Tag {
  export interface Dto {
    id: number;
    label: number;
  }
}

export class Tag extends AbstractModel {
  constructor(
    id: number,
    public label: number
  ) {
    super(id);
  }

  static fromDto(dto: Tag.Dto): Tag {
    return new Tag(
      dto.id,
      dto.label
    );
  }

  toDto(): Tag.Dto {
    return {
      id: undefined,
      label: this.label
    };
  }
}
