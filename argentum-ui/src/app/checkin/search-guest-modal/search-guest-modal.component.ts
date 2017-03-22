import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Guest } from '../../common/model/guest';
import { Observable, Subject } from 'rxjs';
import { RestService } from '../../common/rest-service/rest.service';
import { CardModalComponent } from '../card-modal/card-modal.component';
import { KeypadModalComponent } from '../../common/keypad-modal/keypad-modal.component';
import { MessageComponent } from '../../common/message/message.component';

@Component({
  selector: 'app-search-guest',
  templateUrl: 'search-guest-modal.component.html',
  styleUrls: ['search-guest-modal.component.scss']
})
export class SearchGuestModalComponent implements OnInit {
  private codeStream = new Subject<string>();
  results: Guest[] = [];
  guest: Guest;

  @ViewChild('codeInput')
  codeInput: ElementRef;

  message: MessageComponent;

  constructor(private restService: RestService, private modalService: NgbModal, public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.codeStream
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(code => code ? this.restService.getGuestsByCode(code) : Observable.of([]))
      .subscribe(guests => this.results = guests);

    this.codeInput.nativeElement.focus();
  }

  search(code: string): void {
    this.codeStream.next(code);
  }

  lockGuest(guest: Guest) {
    this.guest = guest;
    this.codeInput.nativeElement.value = `${guest.code} ${guest.name}`;
    this.codeInput.nativeElement.disabled = true;
  }

  checkIn() {
    this.restService.checkIn(this.guest)
      .then((date: Date) => {
        this.guest.checkedIn = date;
        this.message.success(`Guest "${this.guest.name}" checked in.`);
      })
      .catch(reason => this.message.error(`Error: ${reason}`));
  }

  setCard() {
    let modal = this.modalService.open(CardModalComponent, { backdrop: 'static', size: 'sm' });
    modal.result.then(card => {
      this.guest.card = card;
      this.restService.registerCard(this.guest, card)
        .then(() => this.message.success(`Card ${card} registered to "${this.guest.name}"`))
        .catch(reason => this.message.error(`Error: ${reason}`));
    }, result => void(0));
  }

  addBalance() {
    let modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;
    modal.result.then(value => {
      this.restService.addBalance(this.guest, value)
        .then(newBalance => {
          this.guest.balance = newBalance;
          this.message.success(`Added €${value.toFixed(2)} to balance of "${this.guest.name}". New balance: €${newBalance.toFixed(2)}`);
        })
        .catch(reason => this.message.error(`Error: ${reason}`));
    }, result => void(0));
  }

  subBalance() {
    let modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;
    modal.result.then(value => {
      this.restService.addBalance(this.guest, -value)
        .then(newBalance => {
          this.guest.balance = newBalance;
          this.message.success(`Removed €${value.toFixed(2)} from balance of "${this.guest.name}". New balance: €${newBalance.toFixed(2)}`);
        })
        .catch(reason => this.message.error(`Error: ${reason}`));
    }, result => void(0));
  }

  addBonus() {
    let modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;
    modal.result.then(value => {
      this.restService.addBonus(this.guest, value)
        .then(newBonus => {
          this.guest.bonus = newBonus;
          this.message.success(`Added €${value.toFixed(2)} to bonus of "${this.guest.name}". New bonus: €${newBonus.toFixed(2)}`);
        })
        .catch(reason => this.message.error(`Error: ${reason}`));
    }, result => void(0));
  }

  subBonus() {
    let modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;
    modal.result.then(value => {
      this.restService.addBonus(this.guest, -value)
        .then(newBonus => {
          this.guest.bonus = newBonus;
          this.message.success(`Removed €${value.toFixed(2)} from bonus of "${this.guest.name}". New bonus: €${newBonus.toFixed(2)}`);
        })
        .catch(reason => this.message.error(`Error: ${reason}`));
    }, result => void(0));
  }

}
