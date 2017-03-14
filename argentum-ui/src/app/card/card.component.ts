import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { RestService } from "../rest-service/rest.service";
import { Guest } from "../guest";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  private readonly MAX_NAME = 100;
  private cardStream: Observable<string>;
  private card = '';
  private balance = '0.00';
  private bonus = '0.00';
  private name = '';

  constructor(private restService: RestService) {
  }

  ngOnInit(): void {
    let numberStream = Observable.fromEvent(document, 'keydown')
      .flatMap((event: KeyboardEvent) => event.key)
      .filter(char => '0123456789'.indexOf(char) > -1);
    this.cardStream = numberStream
      .scan((acc, char) => acc + char)
      .debounceTime(500)
      .first()
      .repeat();

    this.cardStream.subscribe(result => this.newNumber(result));
  }

  newNumber(card: string) {
    this.card = card.slice(-10);
    this.restService.getGuestByCard(card).then((guest: Guest) => {
      if (guest) {
        this.name = guest.name;
        this.balance = '' + guest.balance.toFixed(2);
        this.bonus = '' + guest.bonus.toFixed(2);
      } else {

      }
    });
  }
}
