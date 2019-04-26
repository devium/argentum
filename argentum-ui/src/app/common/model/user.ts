import {Group} from './group';
import {AbstractModel} from './abstract-model';

export namespace User {
  export interface Dto {
    id: number;
    username: string;
    password: string;
    groups: number[];
  }
}

export class User extends AbstractModel {
  constructor(
    id: number,
    public username: string,
    public password: string,
    public groups: Group[]
  ) {
    super(id);
  }

  static fromDto(dto: User.Dto, allGroups: Group[]): User {
    return new User(
      dto.id,
      dto.username,
      undefined,
      allGroups.filter((group: Group) => dto.groups.includes(group.id))
    );
  }

  toDto(): User.Dto {
    return {
      id: undefined,
      username: this.username,
      password: this.password,
      groups: this.groups.map((group: Group) => group.id)
    };
  }
}
