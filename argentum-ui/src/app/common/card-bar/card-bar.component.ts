import {first, debounceTime, scan, mergeMap, filter, repeat, map} from 'rxjs/operators';
import {
  Component,
  Input, OnDestroy,
  OnInit, ViewChild
} from '@angular/core';
import {Guest} from '../model/guest';
import {Observable, Subscription, Subject, fromEvent} from 'rxjs';
import {AnimationEvent, animate, state, style, transition, trigger} from '@angular/animations';
import {Status} from '../model/status';
import {MessageComponent} from '../message/message.component';
import {OrderHistoryComponent} from '../order-history/order-history.component';
import {convertCard, isDarkBackground} from '../utils';

enum ScanState {
  Waiting,
  Valid,
  NotFound
}

@Component({
  selector: 'app-card-bar',
  templateUrl: 'card-bar.component.html',
  styleUrls: ['card-bar.component.scss'],
  animations: [
    trigger('startCountdown', [
      state('full', style({
        width: '100%'
      })),
      state('empty', style({
        width: '0%'
      })),
      state('reset', style({
        width: '0%'
      })),
      transition('full => empty', animate('10s linear'))
    ])
  ]
})
export class CardBarComponent implements OnInit, OnDestroy {
  scanState = ScanState;

  cardStream: Observable<string>;
  card = '';
  keyboardSub: Subscription;
  guest: Guest = null;
  status: Status = null;
  countdownState = 'empty';
  countdownStream = new Subject();
  countdownSub: Subscription;
  state: ScanState = ScanState.Waiting;
  active = true;
  statuses: Status[] = [];

  flushInputTimeout = 500;
  cardTimeout = 10000;

  @Input()
  fullscreen: boolean;

  @Input()
  message: MessageComponent;

  @ViewChild('orderHistory')
  orderHistory: OrderHistoryComponent;

  constructor() {
  }

  ngOnInit(): void {
    this.cardStream = fromEvent(document, 'keydown').pipe(
      filter((event: KeyboardEvent) => '0123456789'.includes(event.key)),
      mergeMap((event: KeyboardEvent) => event.key),
      scan((acc, char) => acc + char),
      debounceTime(this.flushInputTimeout),
      first(),
    ).pipe(
      map(card => convertCard(card)),
      repeat()
    );

    this.keyboardSub = this.cardStream.subscribe(result => this.newNumber(result));

    this.countdownSub = this.countdownStream.pipe(
      debounceTime(this.cardTimeout))
      .subscribe(() => this.setState(ScanState.Waiting));

    // TODO
    // this.restService.getStatuses()
    Promise.resolve([])
      .then((statuses: Status[]) => this.statuses = statuses)
      .catch(error => void (0));
  }

  ngOnDestroy(): void {
    this.keyboardSub.unsubscribe();
    this.countdownSub.unsubscribe();
  }

  newNumber(card: string): void {
    if (!this.active) {
      return;
    }

    this.card = card.slice(-10);
    // TODO
    // this.restService.getGuestByCard(card)
    Promise.resolve({})
      .then((guest: Guest) => {
        this.guest = guest;
        this.status = this.resolveStatus(guest);
        this.setState(ScanState.Valid);
        this.startCountdown();

        if (this.orderHistory) {
          this.orderHistory.getOrderHistory(guest.card);
        }
      })
      .catch(reason => {
        this.setState(ScanState.NotFound);
        this.startCountdown();
      });
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

  startCountdown() {
    this.countdownState = 'full';
    this.countdownStream.next();
  }

  countdownAnimationDone(event: AnimationEvent) {
    if (event.toState === 'full') {
      this.countdownState = 'empty';
    }
  }

  setState(newState: ScanState) {
    this.state = newState;
    if (newState === ScanState.Waiting) {
      this.guest = null;
      this.card = '';
    } else if (newState === ScanState.NotFound) {
      this.guest = null;
    }
    if (this.orderHistory) {
      if (newState === ScanState.Valid) {
        this.orderHistory.getOrderHistory(this.guest.card);
      } else {
        this.orderHistory.clear();
      }
    }
  }

  reset() {
    this.setState(ScanState.Waiting);
    this.countdownState = 'reset';
  }
}
