import {of as observableOf, Observable, Subject} from 'rxjs';

import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Guest} from '../../common/model/guest';
import {RestService} from '../../common/rest-service/rest.service';
import {CardModalComponent} from '../card-modal/card-modal.component';
import {KeypadModalComponent} from '../../common/keypad-modal/keypad-modal.component';
import {MessageComponent} from '../../common/message/message.component';


import {RoleBasedComponent} from '../../common/role-based/role-based.component';
import {Status} from '../../common/model/status';
import {isDarkBackground} from '../../common/util/is-dark-background';
import {distinctUntilChanged} from 'rxjs/internal/operators/distinctUntilChanged';

@Component({
  selector: 'app-search-guest',
  templateUrl: 'search-guest-modal.component.html',
  styleUrls: ['search-guest-modal.component.scss']
})
export class SearchGuestModalComponent extends RoleBasedComponent implements OnInit {
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

  constructor(private restService: RestService, private modalService: NgbModal, public activeModal: NgbActiveModal) {
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

    this.restService.getStatuses()
      .then((statuses: Status[]) => this.statuses = statuses)
      .catch(reason => this.message.error(reason));
  }

  requestSearch(search: string) {
    if (search) {
      return this.restService.getGuestsBySearch(this.searchField, search);
    } else {
      return observableOf([]);
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
      return {
        id: -1,
        internalName: guest.status,
        displayName: guest.status,
        color: '#ffffff'
      };
    }
  }

  isDarkBackground(color: string): boolean {
    return isDarkBackground(color);
  }

  checkIn() {
    this.restService.checkIn(this.guest)
      .then((date: Date) => {
        this.guest.checkedIn = date;
        this.message.success(`Guest <b>${this.guest.name}</b> checked in.`);
      })
      .catch(reason => this.message.error(reason));
  }

  setCard() {
    const modal = this.modalService.open(CardModalComponent, {backdrop: 'static', size: 'sm'});
    modal.result.then(card => {
      this.guest.card = card;
      this.restService.registerCard(this.guest, card)
        .then(() => this.message.success(`Card <b>${card}</b> registered to <b>${this.guest.name}</b>`))
        .catch(reason => this.message.error(reason));
    }, result => void (0));
  }

  addBalance() {
    const modal = this.modalService.open(KeypadModalComponent, {backdrop: 'static', size: 'sm'});
    modal.result.then(value => {
      this.restService.addBalance(this.guest, value)
        .then(newBalance => {
          this.guest.balance = newBalance;
          this.message.success(`
            Added <b>€${value.toFixed(2)}</b>
            to balance of <b>${this.guest.name}</b>.
            New balance: <b>€${newBalance.toFixed(2)}</b>
          `);
        })
        .catch(reason => this.message.error(reason));
    }, result => void (0));
  }

  subBalance() {
    const modal = this.modalService.open(KeypadModalComponent, {backdrop: 'static', size: 'sm'});
    modal.result.then(value => {
      this.restService.addBalance(this.guest, -value)
        .then(newBalance => {
          this.guest.balance = newBalance;
          this.message.success(`
            Removed <b>€${value.toFixed(2)}</b>
            from balance of <b>${this.guest.name}</b>.
            New balance: <b>€${newBalance.toFixed(2)}</b>
          `);
        })
        .catch(reason => this.message.error(reason));
    }, result => void (0));
  }

  addBonus() {
    const modal = this.modalService.open(KeypadModalComponent, {backdrop: 'static', size: 'sm'});
    modal.result.then(value => {
      this.restService.addBonus(this.guest, value)
        .then(newBonus => {
          this.guest.bonus = newBonus;
          this.message.success(`
            Added <b>€${value.toFixed(2)}</b>
            to bonus of <b>${this.guest.name}</b>.
            New bonus: <b>€${newBonus.toFixed(2)}</b>
          `);
        })
        .catch(reason => this.message.error(reason));
    }, result => void (0));
  }

  subBonus() {
    const modal = this.modalService.open(KeypadModalComponent, {backdrop: 'static', size: 'sm'});
    modal.result.then(value => {
      this.restService.addBonus(this.guest, -value)
        .then(newBonus => {
          this.guest.bonus = newBonus;
          this.message.success(`
            Removed <b>€${value.toFixed(2)}</b>
            from bonus of <b>${this.guest.name}</b>.
            New bonus: <b>€${newBonus.toFixed(2)}</b>
          `);
        })
        .catch(reason => this.message.error(reason));
    }, result => void (0));
  }

}
