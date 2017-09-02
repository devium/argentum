import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KeypadModalComponent } from '../../common/keypad-modal/keypad-modal.component';
import { Guest } from '../../common/model/guest';
import { CardModalComponent } from '../card-modal/card-modal.component';
import { RoleBasedComponent } from '../../common/role-based/role-based.component';

@Component({
  selector: 'app-new-guest',
  templateUrl: 'new-guest-modal.component.html',
  styleUrls: ['new-guest-modal.component.scss']
})
export class NewGuestModalComponent extends RoleBasedComponent implements OnInit {
  name = '';
  mail = '';
  status = '';
  card: string;
  balance = 0;
  bonus = 0;

  @ViewChild('nameInput')
  nameInput: ElementRef;

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.nameInput.nativeElement.focus();
  }

  setCard() {
    const modal = this.modalService.open(CardModalComponent, { backdrop: 'static', size: 'sm' });
    modal.result.then(result => this.card = result, result => void(0));
  }

  addBalance() {
    const modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    modal.result.then(result => this.balance += result, result => void(0));
  }

  subBalance() {
    const modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    modal.result.then(result => this.balance -= result, result => void(0));
  }

  addBonus() {
    const modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    modal.result.then(result => this.bonus += result, result => void(0));
  }

  subBonus() {
    const modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    modal.result.then(result => this.bonus -= result, result => void(0));
  }

  confirm(): void {
    const guest: Guest = {
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
