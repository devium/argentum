import {AbstractModel} from './abstract-model';

export interface GroupDto {
  id: number;
  name: string;
}

export class Group extends AbstractModel {
  constructor(
    id: number,
    public name: string
  ) {
    super(id);
  }

  static fromDto(dto: GroupDto): Group {
    return new Group(
      dto.id,
      dto.name
    );
  }
}
