import { User } from '../../model/user';

export class UserResponse {
  id: number;
  username: string;
  roles: string[];
}

export function toUser(response: UserResponse): User {
  return null;
  // return {
  //   id: response.id,
  //   username: response.username,
  //   password: null,
  //   roles: response.roles
  // };
}
