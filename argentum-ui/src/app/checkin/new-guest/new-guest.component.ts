import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KeypadComponent } from '../../common/keypad/keypad.component';
import { Guest } from '../../common/model/guest';

@Component({
  selector: 'app-new-guest',
  templateUrl: 'new-guest.component.html',
  styleUrls: ['new-guest.component.scss']
})
export class NewGuestComponent implements OnInit {
  name = '';
  mail = '';
  status = '';
  card = '-';
  balance = 0;
  bonus = 0;

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

  setBalance() {
    let modal = this.modalService.open(KeypadComponent, { backdrop: 'static', size: 'sm' });
    modal.result.then(result => this.balance = result, result => void(0));
  }

  setBonus() {
    let modal = this.modalService.open(KeypadComponent, { backdrop: 'static', size: 'sm' });
    modal.result.then(result => this.bonus = result, result => void(0));
  }

  confirm(): void {
    let guest: Guest = {
      id: -1,
      code: null,
      name: this.name,
      mail: this.mail,
      status: this.status,
      checkedIn: new Date(),
      card: this.card,
      balance: this.balance,
      bonus: this.bonus
    };
    this.activeModal.close(guest);
  }

}
