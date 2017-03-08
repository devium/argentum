import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  @ViewChild('cardEntry') cardEntry: ElementRef;
  private cardSearch = new Subject<string>();
  private cardResult: Observable<string>;

  constructor() {
  }

  ngOnInit(): void {
    this.cardResult = this.cardSearch
      .debounceTime(500)
      .distinctUntilChanged();

    this.cardResult.subscribe(result => this.cardEntry.nativeElement.select());
  }

  private search(value: string): void {
    this.cardSearch.next(value);
  }

  @HostListener('window:keydown', ['$event'])
  ignoreEnter(event: KeyboardEvent) {
    this.cardEntry.nativeElement.focus();
  }

}
