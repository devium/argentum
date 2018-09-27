import { Guest } from '../../model/guest';

export class GuestResponse {
  id: number;
  code: string;
  name: string;
  mail: string;
  status: string;
  checkedIn: number;
  card: string;
  balance: number;
  bonus: number;
}

export function toGuest(response: GuestResponse): Guest {
  return new Guest(
    response.id,
    response.code,
    response.name,
    response.mail,
    response.status,
    response.checkedIn ? new Date(response.checkedIn) : null,
    response.card,
    response.balance,
    response.bonus
  );
}
