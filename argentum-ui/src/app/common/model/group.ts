import {AbstractModel} from './abstract-model';

export namespace Group {
  export interface Dto {
    id: number;
    name: string;
  }
}

export class Group extends AbstractModel {
  constructor(
    id: number,
    public name: string
  ) {
    super(id);
  }

  static fromDto(dto: Group.Dto): Group {
    return new Group(
      dto.id,
      dto.name
    );
  }
}
