import {Group} from './group';
import {AbstractModel} from './abstract-model';

export interface UserDto {
  id: number;
  username: string;
  password: string;
  groups: number[];
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

  static fromDto(dto: UserDto, allGroups: Group[]): User {
    return new User(
      dto.id,
      dto.username,
      undefined,
      allGroups.filter((group: Group) => dto.groups.includes(group.id))
    );
  }

  toDto(): UserDto {
    return {
      id: undefined,
      username: this.username,
      password: this.password,
      groups: this.groups.map((group: Group) => group.id)
    };
  }
}
