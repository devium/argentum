import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Guest } from '../../common/model/guest';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { RestService } from '../../common/rest-service/rest.service';
import { CardModalComponent } from '../card-modal/card-modal.component';
import { KeypadModalComponent } from '../../common/keypad-modal/keypad-modal.component';
import { MessageComponent } from '../../common/message/message.component';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/observable/of';
import { RoleBasedComponent } from '../../common/role-based/role-based.component';
import { Status } from '../../common/model/status';
import { isDarkBackground } from '../../common/util/is-dark-background';

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
    this.inputSearchStream
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(search => this.searchStream.next(search));
    this.searchStream
      .switchMap(search => this.requestSearch(search))
      .subscribe((guests: Guest[]) => this.results = guests);

    this.searchInput.nativeElement.focus();

    this.restService.getStatuses()
      .then((statuses: Status[]) => this.statuses = statuses)
      .catch(reason => this.message.error(reason));
  }

  requestSearch(search: string) {
    if (search) {
      return this.restService.getGuestsBySearch(this.searchField, search);
    } else {
      return Observable.of([]);
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
        this.message.success(`Guest "${this.guest.name}" checked in.`);
      })
      .catch(reason => this.message.error(reason));
  }

  setCard() {
    const modal = this.modalService.open(CardModalComponent, { backdrop: 'static', size: 'sm' });
    modal.result.then(card => {
      this.guest.card = card;
      this.restService.registerCard(this.guest, card)
        .then(() => this.message.success(`Card ${card} registered to "${this.guest.name}"`))
        .catch(reason => this.message.error(reason));
    }, result => void(0));
  }

  addBalance() {
    const modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    modal.result.then(value => {
      this.restService.addBalance(this.guest, value)
        .then(newBalance => {
          this.guest.balance = newBalance;
          this.message.success(
            `Added €${value.toFixed(2)} to balance of "${this.guest.name}". New balance: €${newBalance.toFixed(2)}`
          );
        })
        .catch(reason => this.message.error(reason));
    }, result => void(0));
  }

  subBalance() {
    const modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    modal.result.then(value => {
      this.restService.addBalance(this.guest, -value)
        .then(newBalance => {
          this.guest.balance = newBalance;
          this.message.success(
            `Removed €${value.toFixed(2)} from balance of "${this.guest.name}". New balance: €${newBalance.toFixed(2)}`
          );
        })
        .catch(reason => this.message.error(reason));
    }, result => void(0));
  }

  addBonus() {
    const modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    modal.result.then(value => {
      this.restService.addBonus(this.guest, value)
        .then(newBonus => {
          this.guest.bonus = newBonus;
          this.message.success(
            `Added €${value.toFixed(2)} to bonus of "${this.guest.name}". New bonus: €${newBonus.toFixed(2)}`
          );
        })
        .catch(reason => this.message.error(reason));
    }, result => void(0));
  }

  subBonus() {
    const modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    modal.result.then(value => {
      this.restService.addBonus(this.guest, -value)
        .then(newBonus => {
          this.guest.bonus = newBonus;
          this.message.success(
            `Removed €${value.toFixed(2)} from bonus of "${this.guest.name}". New bonus: €${newBonus.toFixed(2)}`
          );
        })
        .catch(reason => this.message.error(reason));
    }, result => void(0));
  }

}
