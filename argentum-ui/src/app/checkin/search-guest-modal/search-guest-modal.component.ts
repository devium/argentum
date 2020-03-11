import {Observable, of, Subject, Subscription} from 'rxjs';

import {debounceTime, switchMap} from 'rxjs/operators';
import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Guest} from '../../common/model/guest';
import {CardModalComponent} from '../../common/card-modal/card-modal.component';
import {MessageComponent} from '../../common/message/message.component';

import {GroupBasedComponent} from '../../common/group-based/group-based.component';
import {distinctUntilChanged} from 'rxjs/internal/operators/distinctUntilChanged';
import {formatTime, isDarkBackground} from '../../common/utils';
import {StatusService} from '../../common/rest-service/status.service';
import {GuestService} from '../../common/rest-service/guest.service';
import {Status} from '../../common/model/status';

@Component({
  selector: 'app-search-guest',
  templateUrl: 'search-guest-modal.component.html',
  styleUrls: ['search-guest-modal.component.scss']
})
export class SearchGuestModalComponent extends GroupBasedComponent implements OnInit, OnDestroy {
  isDarkBackground = isDarkBackground;
  formatTime = formatTime;

  private inputSearchStream = new Subject<string>();
  private inputSearchSubscription: Subscription;
  results: Guest[] = [];
  guest: Guest;

  @ViewChild('searchInput', { static: true })
  searchInput: ElementRef;
  searchField: 'code' | 'name' | 'mail' = 'code';

  message: MessageComponent;
  statuses: Status[] = [];

  noStatus = new Status(undefined, undefined, 'No Status', '#ffffff');

  constructor(
    private statusService: StatusService,
    private guestService: GuestService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.inputSearchSubscription = this.inputSearchStream.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(search => this.searchInstantly(search));

    this.searchInput.nativeElement.focus();

    this.statusService.list().subscribe(
      (statuses: Status[]) => this.statuses = statuses,
      (error: string) => this.message.error(error)
    );
  }

  ngOnDestroy(): void {
    this.inputSearchSubscription.unsubscribe();
  }

  requestSearch(search: string): Observable<Guest[]> {
    if (search) {
      return this.guestService.listFiltered({[this.searchField]: search});
    } else {
      return of([]);
    }
  }

  search(search: string): void {
    this.inputSearchStream.next(search);
  }

  searchInstantly(search: string): void {
    this.requestSearch(search).subscribe(
      (guests: Guest[]) => this.results = guests.slice(0, 5),
      (error: string) => this.message.error(error)
    );
  }

  lockGuest(guest: Guest) {
    this.guest = guest;
    this.searchInput.nativeElement.value = `${guest.code} ${guest.name} <${guest.mail}>`;
    this.searchInput.nativeElement.disabled = true;
  }

  clearGuest() {
    this.guest = null;
    this.searchInput.nativeElement.value = '';
    this.searchInput.nativeElement.disabled = false;
    this.searchInput.nativeElement.focus();
    this.results = [];
  }

  checkIn() {
    this.guestService.checkIn(this.guest, this.statuses).subscribe(
      (guest: Guest) => this.guest = guest,
      (error: string) => this.message.error(error)
    );
  }

  setCard() {
    this.modalService.open(CardModalComponent, {backdrop: 'static', size: 'sm'}).result.then(
      (card: string) => {
        this.guestService.setCard(this.guest, card, this.statuses).subscribe(
          (guest: Guest) => this.guest = guest,
          (error: string) => this.message.error(error)
        );
      },
      (cancel: string) => void (0)
    );
  }
}
