import {Status} from '../../model/status';

export namespace Statuses {
  export const PAID = new Status(1, 'paid', 'Paid', '#00ff00');
  export const PENDING = new Status(2, 'pending', 'Pending', '#ff0000');

  export const ALL = [PAID, PENDING];

  export const STAFF = new Status(3, 'staff', 'Staff', '#0000ff');
  export const PENDING_PATCHED = new Status(2, 'pen', 'Pending', '#ff0000');
}
