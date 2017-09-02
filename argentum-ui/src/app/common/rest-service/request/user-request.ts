import { User } from '../../model/user';
export class UserRequest {
  id: number;
  username: string;
  password: string;
  roles: string[];
}

export function fromUser(user: User): UserRequest {
  return {
    id: user.id,
    username: user.username,
    password: user.password.length > 0 ? user.password : null,
    roles: user.roles
  };
}
