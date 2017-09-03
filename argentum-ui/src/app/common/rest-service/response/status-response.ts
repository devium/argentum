import { Status } from '../../model/status';
export class StatusResponse {
  id: number;
  internalName: string;
  displayName: string;
  color: string;
}

export function toStatus(response: StatusResponse): Status {
  return {
    id: response.id,
    internalName: response.internalName,
    displayName: response.displayName,
    color: response.color
  };
}
