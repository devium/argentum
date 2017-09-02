import {
  AnimationTransitionEvent,
  Component,
  Input, OnDestroy,
  OnInit
} from '@angular/core';
import { RestService } from '../rest-service/rest.service';
import { Guest } from '../model/guest';
import { convertCard } from '../util/convert-card';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/repeat';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
      transition('full => empty', animate(`10s linear`))
    ])
  ]
})
export class CardBarComponent implements OnInit, OnDestroy {
  scanState = ScanState;

  cardStream: Observable<string>;
  card = '';
  keyboardSub: Subscription;
  guest: Guest;
  countdownState = 'empty';
  countdownStream = new Subject();
  state: ScanState = ScanState.Waiting;
  active = true;

  @Input()
  fullscreen: boolean;

  constructor(private restService: RestService) {
  }

  ngOnInit(): void {
    this.cardStream = Observable.fromEvent(document, 'keydown')
      .filter((event: KeyboardEvent) => '0123456789'.includes(event.key))
      .flatMap((event: KeyboardEvent) => event.key)
      .scan((acc, char) => acc + char)
      .debounceTime(500)
      .first()
      .map(card => convertCard(card))
      .repeat();

    this.keyboardSub = this.cardStream.subscribe(result => this.newNumber(result));

    this.countdownStream
      .debounceTime(10000)
      .subscribe(() => this.setState(ScanState.Waiting));
  }

  ngOnDestroy(): void {
    this.keyboardSub.unsubscribe();
  }

  newNumber(card: string): void {
    if (!this.active) {
      return;
    }

    this.card = card.slice(-10);
    this.restService.getGuestByCard(card)
      .then((guest: Guest) => {
        this.guest = guest;
        this.setState(ScanState.Valid);
        this.startCountdown();
      })
      .catch(reason => {
        this.setState(ScanState.NotFound);
        this.startCountdown();
      });
  }

  startCountdown() {
    this.countdownState = 'full';
    this.countdownStream.next();
  }

  countdownAnimationDone(event: AnimationTransitionEvent) {
    if (event.toState === 'full') {
      this.countdownState = 'empty';
    }
  }

  setState(state: ScanState) {
    this.state = state;
    if (state === ScanState.Waiting) {
      this.guest = null;
      this.card = '';
    } else if (state === ScanState.NotFound) {
      this.guest = null;
    }
  }
}
