import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Observable } from "rxjs";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @ViewChild('cardEntry') cardEntry: ElementRef;
  private cardStream: Observable<string>;
  private card = '0088888800';
  private balance = '0.00';
  private name = 'Some Very Very Very Very Long Name';

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
