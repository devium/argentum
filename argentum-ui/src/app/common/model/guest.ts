export class Guest {
  id: number;
  code: string;
  name: string;
  mail: string;
  status: string;
  checkedIn: Date;
  card: string;
  balance: number;
  bonus: number;


  constructor(
    id: number,
    code: string = '',
    name: string = '',
    mail: string = '',
    status: string = null,
    checkedIn: Date = null,
    card: string = null,
    balance: number = 0,
    bonus: number = 0
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.mail = mail;
    this.status = status;
    this.checkedIn = checkedIn;
    this.card = card;
    this.balance = balance;
    this.bonus = bonus;
  }
}
