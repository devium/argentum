import { Guest } from '../../model/guest';

export class CoatCheckTagsRequest {
  ids: number[];
  guestId: number;
  price: number;
}

export function fromCoatCheckTagIds(ids: number[], guest: Guest, price: number) {
  return {
    ids: ids,
    guestId: guest.id,
    price: price
  };
}
