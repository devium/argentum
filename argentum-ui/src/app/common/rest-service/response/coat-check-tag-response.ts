import { GuestResponse, toGuest } from './guest-response';
import { CoatCheckTag } from '../../model/coat-check-tag';

export class CoatCheckTagResponse {
  id: number;
  time: number;
  guest: GuestResponse;
}

export function toCoatCheckTag(response: CoatCheckTagResponse): CoatCheckTag {
  return {
    id: response.id,
    time: new Date(response.time),
    guest: toGuest(response.guest)
  };
}
