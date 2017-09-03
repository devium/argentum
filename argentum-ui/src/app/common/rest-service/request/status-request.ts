import { Status } from '../../model/status';
export class StatusRequest {
  id: number;
  internalName: string;
  displayName: string;
  color: string;
}

export function fromStatus(status: Status): StatusRequest {
  return {
    id: status.id,
    internalName: status.internalName,
    displayName: status.displayName,
    color: status.color
  };
}
