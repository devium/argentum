import { Guest } from '../../model/guest';
export class GuestRequest {
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

export function fromGuest(guest: Guest): GuestRequest {
  return {
    id: guest.id,
    code: guest.code,
    name: guest.name,
    mail: guest.mail,
    status: guest.status,
    checkedIn: guest.checkedIn ? guest.checkedIn.getTime() : null,
    card: guest.card,
    balance: guest.balance,
    bonus: guest.bonus
  };
}
