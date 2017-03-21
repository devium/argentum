import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RestService } from '../../common/rest-service/rest.service';
import { Guest } from '../../common/model/guest';
import { convertCard } from '../../common/util/convert-card';

enum ScanState {
  Waiting,
  Valid,
  NotFound
}

@Component({
  selector: 'app-card-bar',
  templateUrl: 'card-bar.component.html',
  styleUrls: ['card-bar.component.scss']
})
export class CardBarComponent implements OnInit {
  private scanState = ScanState;
  private readonly MAX_NAME = 28;
  private cardStream: Observable<string>;
  private card = '';
  private balance = '';
  private bonus = '';
  private name = '';
  private countdown = 0;
  private countdownStream: Subject<number>;
  private state: ScanState = ScanState.Waiting;

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

    const start = 10;
    const tps = 1;
    this.countdownStream = new Subject<number>();
    this.countdownStream
      .switchMap(old => Observable
        .timer(0, 1000 / tps)
        .take(start * tps + 1)
        .map(i => (start - i / tps) / start * 100))
      .subscribe(i => {
        this.countdown = i;
        if (i <= 0) {
          this.name = '';
          this.balance = '';
          this.bonus = '';
          this.card = '';
          this.state = ScanState.Waiting;
        }
      });
  }

  newNumber(card: string) {
    this.card = card.slice(-10);
    this.restService.getGuestByCard(card).then((guest: Guest) => {
      if (guest) {
        this.name = guest.name;
        this.balance = '' + guest.balance.toFixed(2);
        this.bonus = '' + guest.bonus.toFixed(2);
        this.state = ScanState.Valid;
      } else {
        this.name = '';
        this.balance = '';
        this.bonus = '';
        this.state = ScanState.NotFound;
      }
      this.countdownStream.next();
    });
  }
}
