import {Status} from '../../model/status';

export namespace Statuses {
  export const PAID = new Status(16010, 'paid', 'Paid', '#00ff00');
  export const PENDING = new Status(16020, 'pending', 'Pending', '#ff0000');

  export const ALL = [PAID, PENDING];

  export const STAFF = new Status(16030, 'staff', 'Staff', '#0000ff');
  export const PENDING_PATCHED_REQUEST = new Status(16021, 'pen', undefined, undefined);
  export const PENDING_PATCHED_RESPONSE = new Status(16021, 'pen', 'Pending', '#ff0000');
}
