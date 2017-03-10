import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  private readonly MAX_NAME = 100;
  private cardStream: Observable<string>;
  private card = '0088888800';
  private balance = '0.00';
  private name = 'Some Very1 Very2 Very3 Very4 Very5 Very6 Long Name';

  constructor() {
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

    this.cardStream.subscribe(result => this.card = result.slice(-10));
  }
}
