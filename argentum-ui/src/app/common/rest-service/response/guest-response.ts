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
  return {
    id: response.id,
    code: response.code,
    name: response.name,
    mail: response.mail,
    status: response.status,
    checkedIn: new Date(response.checkedIn),
    card: response.card,
    balance: response.balance,
    bonus: response.bonus
  };
}
