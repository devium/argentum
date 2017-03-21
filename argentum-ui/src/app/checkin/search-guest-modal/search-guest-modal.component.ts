import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Guest } from '../../common/model/guest';
import { Observable, Subject } from 'rxjs';
import { RestService } from '../../common/rest-service/rest.service';
import { CardModalComponent } from '../card-modal/card-modal.component';
import { KeypadModalComponent } from '../../common/keypad-modal/keypad-modal.component';

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

  constructor(private restService: RestService, private modalService: NgbModal, public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.codeStream
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(code => code ? this.restService.getGuestsByCode(code) : Observable.of([]))
      .subscribe(guests => this.results = guests);
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
    this.guest.checkedIn = new Date();
  }

  setCard() {
    let modal = this.modalService.open(CardModalComponent, { backdrop: 'static', size: 'sm' });
    modal.result.then(result => {
      this.guest.card = result;
      this.restService.registerCard(this.guest, result);
    }, result => void(0));
  }

  addBalance() {
    let modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;
    modal.result.then(result => this.guest.balance += result, result => void(0));
  }

  subBalance() {
    let modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;
    modal.result.then(result => this.guest.balance -= result, result => void(0));
  }

  addBonus() {
    let modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;
    modal.result.then(result => this.guest.bonus += result, result => void(0));
  }

  subBonus() {
    let modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;
    modal.result.then(result => this.guest.bonus -= result, result => void(0));
  }

  confirm(): void {
    this.activeModal.close();
  }

}
