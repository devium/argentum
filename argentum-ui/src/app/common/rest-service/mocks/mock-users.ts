import { User } from '../../model/user';

export const ADMIN: User = {
  id: 1,
  username: 'admin',
  password: '12345',
  roles: ['ADMIN', 'ORDER', 'CHECKIN', 'TRANSFER', 'ALL_RANGES']
};
export const BARKEEPER: User = {
  id: 2,
  username: 'bar',
  password: '121212',
  roles: ['ORDER', 'RANGE_1']
};
export const RECEPTION: User = {
  id: 3,
  username: 'checkin',
  password: '321',
  roles: ['TRANSFER', 'CHECKIN']
};

export const USERS = [ADMIN, BARKEEPER, RECEPTION];
