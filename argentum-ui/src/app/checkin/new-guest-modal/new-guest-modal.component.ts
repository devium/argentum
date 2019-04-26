import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KeypadModalComponent } from '../../common/keypad-modal/keypad-modal.component';
import { Guest } from '../../common/model/guest';
import { CardModalComponent } from '../card-modal/card-modal.component';
import { GroupBasedComponent } from '../../common/group-based/group-based.component';
import { Status } from '../../common/model/status';
import { MessageComponent } from '../../common/message/message.component';
import { isDarkBackground } from '../../common/util/is-dark-background';

@Component({
  selector: 'app-new-guest',
  templateUrl: 'new-guest-modal.component.html',
  styleUrls: ['new-guest-modal.component.scss']
})
export class NewGuestModalComponent extends GroupBasedComponent implements OnInit {
  name = '';
  mail = '';
  status: Status = null;
  card: string;
  balance = 0;
  bonus = 0;
  statuses: Status[] = [];

  @ViewChild('nameInput')
  nameInput: ElementRef;

  message: MessageComponent;

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.nameInput.nativeElement.focus();

    // TODO
    // this.restService.getStatuses()
    Promise.resolve([])
      .then((statuses: Status[]) => this.statuses = statuses)
      .catch(reason => this.message.error(reason));
  }

  isDarkBackground(color: string): boolean {
    return isDarkBackground(color);
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
    const guest: Guest = new Guest(
      -1,
      null,
      this.name,
      this.mail,
      this.status ? this.status.internalName : '',
      new Date(),
      this.card,
      this.balance,
      this.bonus
  );
    this.activeModal.close(guest);
  }

}
