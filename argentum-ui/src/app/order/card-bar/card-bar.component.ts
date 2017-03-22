import { animate, AnimationTransitionEvent, Component, OnInit, state, style, transition, trigger } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RestService } from '../../common/rest-service/rest.service';
import { Guest } from '../../common/model/guest';
import { convertCard } from '../../common/util/convert-card';

enum ScanState {
  Waiting,
  Valid,
  NotFound
}

const CARD_TIMEOUT_MS = 10000;

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
      transition('full => empty', animate(`${CARD_TIMEOUT_MS}ms linear`))
    ])
  ]
})
export class CardBarComponent implements OnInit {
  scanState = ScanState;
  readonly MAX_NAME = 28;

  cardStream: Observable<string>;
  card = '';
  guest: Guest;
  countdownState = 'empty';
  countdownStream = new Subject();
  state: ScanState = ScanState.Waiting;

  constructor(private restService: RestService) {
  }

  ngOnInit(): void {
    this.cardStream = Observable.fromEvent(document, 'keydown')
      .filter((event: KeyboardEvent) => '0123456789'.indexOf(event.key) > -1)
      .flatMap((event: KeyboardEvent) => event.key)
      .scan((acc, char) => acc + char)
      .debounceTime(500)
      .first()
      .map(card => convertCard(card))
      .repeat();

    this.cardStream.subscribe(result => this.newNumber(result));

    this.countdownStream
      .debounceTime(CARD_TIMEOUT_MS)
      .subscribe(() => this.setState(ScanState.Waiting));
  }

  newNumber(card: string) {
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
    if (event.toState == 'full') {
      this.countdownState = 'empty';
    }
  }

  setState(state: ScanState) {
    this.state = state;
    if (state == ScanState.Waiting) {
      this.guest = null;
      this.card = '';
    } else if (state == ScanState.NotFound) {
      this.guest = null;
    }
  }
}
