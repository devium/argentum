import { Status } from '../model/status';


export const STATUSES: Status[] = [
  {
    id: 0,
    internalName: 'default',
    displayName: 'Default',
    color: '#ffffff'
  },
  {
    id: 1,
    internalName: 'registered',
    displayName: 'Registered',
    color: '#ff0000'
  },
  {
    id: 2,
    internalName: 'paid',
    displayName: 'Paid',
    color: '#00ff00'
  },
];
