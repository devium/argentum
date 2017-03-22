import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KeypadModalComponent } from '../../common/keypad-modal/keypad-modal.component';
import { Guest } from '../../common/model/guest';
import { CardModalComponent } from '../card-modal/card-modal.component';

@Component({
  selector: 'app-new-guest',
  templateUrl: 'new-guest-modal.component.html',
  styleUrls: ['new-guest-modal.component.scss']
})
export class NewGuestModalComponent implements OnInit {
  name = '';
  mail = '';
  status = '';
  card: string;
  balance = 0;
  bonus = 0;

  @ViewChild('nameInput')
  nameInput: ElementRef;

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.nameInput.nativeElement.focus();
  }

  setCard() {
    let modal = this.modalService.open(CardModalComponent, { backdrop: 'static', size: 'sm' });
    modal.result.then(result => this.card = result, result => void(0));
  }

  addBalance() {
    let modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;
    modal.result.then(result => this.balance += result, result => void(0));
  }

  subBalance() {
    let modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;
    modal.result.then(result => this.balance -= result, result => void(0));
  }

  addBonus() {
    let modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;
    modal.result.then(result => this.bonus += result, result => void(0));
  }

  subBonus() {
    let modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;
    modal.result.then(result => this.bonus -= result, result => void(0));
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
