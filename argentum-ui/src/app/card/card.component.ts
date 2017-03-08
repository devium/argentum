import { Component, OnInit } from "@angular/core";
import { Subject, Observable } from "rxjs";

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  private cardSearch = new Subject<string>();
  private cardResult: Observable<string>;

  constructor() {
  }

  ngOnInit(): void {
    this.cardResult = this.cardSearch
      .debounceTime(500)
      .distinctUntilChanged();
  }

  private search(value: string): void {
    this.cardSearch.next(value);
  }

}
