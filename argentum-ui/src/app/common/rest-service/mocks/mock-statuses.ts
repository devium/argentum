import { Status } from '../../model/status';

export const DEFAULT: Status = {
  id: 1,
  internalName: 'default',
  displayName: 'Default',
  color: '#aaaaff'
};
export const REGISTERED: Status = {
  id: 2,
  internalName: 'registered',
  displayName: 'Registered',
  color: '#ff0000'
};
export const PAID: Status = {
  id: 3,
  internalName: 'paid',
  displayName: 'Paid',
  color: '#00ff00'
};

export const STATUSES: Status[] = [DEFAULT, REGISTERED, PAID];
