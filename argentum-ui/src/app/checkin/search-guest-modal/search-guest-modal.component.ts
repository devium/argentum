import {Observable, of, Subject} from 'rxjs';

import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Guest} from '../../common/model/guest';
import {CardModalComponent} from '../../common/card-modal/card-modal.component';
import {KeypadModalComponent} from '../../common/keypad-modal/keypad-modal.component';
import {MessageComponent} from '../../common/message/message.component';


import {GroupBasedComponent} from '../../common/group-based/group-based.component';
import {Status} from '../../common/model/status';
import {distinctUntilChanged} from 'rxjs/internal/operators/distinctUntilChanged';
import {formatCurrency, isDarkBackground} from '../../common/utils';

@Component({
  selector: 'app-search-guest',
  templateUrl: 'search-guest-modal.component.html',
  styleUrls: ['search-guest-modal.component.scss']
})
export class SearchGuestModalComponent extends GroupBasedComponent implements OnInit {
  private inputSearchStream = new Subject<string>();
  private searchStream = new Subject<string>();
  statuses: Status[] = [];
  results: Guest[] = [];
  guest: Guest;
  status: Status;

  @ViewChild('searchInput')
  searchInput: ElementRef;
  searchField = 'code';

  message: MessageComponent;

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.inputSearchStream.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(search => this.searchStream.next(search));
    this.searchStream.pipe(
      switchMap(search => this.requestSearch(search))
    ).subscribe((guests: Guest[]) => this.results = guests);

    this.searchInput.nativeElement.focus();

    // TODO
    // this.restService.getStatuses()
    Promise.resolve([])
      .then((statuses: Status[]) => this.statuses = statuses)
      .catch(reason => this.message.error(reason));
  }

  requestSearch(search: string): Observable<Guest[]> {
    if (search) {
      // TODO
      // return this.restService.getGuestsBySearch(this.searchField, search);
      return of([]);
    } else {
      return of([]);
    }
  }

  search(search: string): void {
    this.searchStream.next(search);
  }

  lockGuest(guest: Guest) {
    this.guest = guest;
    this.status = this.resolveStatus(guest);
    this.searchInput.nativeElement.value = `${guest.code} ${guest.name} <${guest.mail}>`;
    this.searchInput.nativeElement.disabled = true;
  }

  clearGuest() {
    this.guest = null;
    this.status = null;
    this.searchInput.nativeElement.value = '';
    this.searchInput.nativeElement.disabled = false;
    this.searchInput.nativeElement.focus();
    this.results = [];
  }

  resolveStatus(guest: Guest): Status {
    const statusMapping = this.statuses.find((status: Status) => status.internalName === guest.status);
    if (statusMapping) {
      return statusMapping;
    } else {
      return new Status(undefined, guest.status, guest.status, '#ffffff');
    }
  }

  isDarkBackground(color: string): boolean {
    return isDarkBackground(color);
  }

  checkIn() {
    // TODO
    // this.restService.checkIn(this.guest)
    Promise.resolve(new Date())
      .then((date: Date) => {
        this.guest.checkedIn = date;
        this.message.success(`Guest <b>${this.guest.name}</b> checked in.`);
      })
      .catch(reason => this.message.error(reason));
  }

  setCard() {
    this.modalService.open(CardModalComponent, {backdrop: 'static', size: 'sm'}).result.then(
      (card: string) => {
        this.guest.card = card;
        // TODO
        // this.restService.registerCard(this.guest, card)
        Promise.resolve()
          .then(() => this.message.success(`Card <b>${card}</b> registered to <b>${this.guest.name}</b>`))
          .catch(reason => this.message.error(reason));
      },
      (cancel: string) => void (0)
    );
  }

  addBalance() {
    this.modalService.open(KeypadModalComponent, {backdrop: 'static', size: 'sm'}).result.then(
      (value: number) => {
        // TODO
        // this.restService.addBalance(this.guest, value)
        Promise.resolve(0)
          .then(newBalance => {
            this.guest.balance = newBalance;
            this.message.success(`
            Added <b>€${formatCurrency(value)}</b>
            to balance of <b>${this.guest.name}</b>.
            New balance: <b>€${formatCurrency(newBalance)}</b>
          `);
          })
          .catch(reason => this.message.error(reason));
      },
      (cancel: string) => void (0)
    );
  }

  subBalance() {
    this.modalService.open(KeypadModalComponent, {backdrop: 'static', size: 'sm'}).result.then(
      (value: number) => {
        // TODO
        // this.restService.addBalance(this.guest, -value)
        Promise.resolve(0)
          .then(newBalance => {
            this.guest.balance = newBalance;
            this.message.success(`
            Removed <b>€${value.toFixed(2)}</b>
            from balance of <b>${this.guest.name}</b>.
            New balance: <b>€${formatCurrency(newBalance)}</b>
          `);
          })
          .catch(reason => this.message.error(reason));
      },
      (cancel: string) => void (0)
    );
  }

  addBonus() {
    this.modalService.open(KeypadModalComponent, {backdrop: 'static', size: 'sm'}).result.then(
      (value: number) => {
        // TODO
        // this.restService.addBonus(this.guest, value)
        Promise.resolve(0)
          .then(newBonus => {
            this.guest.bonus = newBonus;
            this.message.success(`
            Added <b>€${value.toFixed(2)}</b>
            to bonus of <b>${this.guest.name}</b>.
            New bonus: <b>€${formatCurrency(newBonus)}</b>
          `);
          })
          .catch(reason => this.message.error(reason));
      },
      (cancel: string) => void (0)
    );
  }

  subBonus() {
    this.modalService.open(KeypadModalComponent, {backdrop: 'static', size: 'sm'}).result.then(
      (value: number) => {
        // TODO
        // this.restService.addBonus(this.guest, -value)
        Promise.resolve(0)
          .then(newBonus => {
            this.guest.bonus = newBonus;
            this.message.success(`
            Removed <b>€${value.toFixed(2)}</b>
            from bonus of <b>${this.guest.name}</b>.
            New bonus: <b>€${formatCurrency(newBonus)}</b>
          `);
          })
          .catch(reason => this.message.error(reason));
      },
      (cancel: string) => void (0));
  }

}
