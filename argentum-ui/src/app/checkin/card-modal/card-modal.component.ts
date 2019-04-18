import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Observable, Subscription, fromEvent} from 'rxjs';
import {convertCard} from '../../common/util/convert-card';
import {debounceTime, filter, flatMap, map, repeat} from 'rxjs/operators';
import {scan} from 'rxjs/internal/operators/scan';
import {first} from 'rxjs/internal/operators/first';

@Component({
  selector: 'app-card-modal',
  templateUrl: './card-modal.component.html',
  styleUrls: ['./card-modal.component.scss']
})
export class CardModalComponent implements OnInit, OnDestroy {
  card: string;
  private cardStream: Observable<string>;
  cardStreamSub: Subscription;

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.cardStream = fromEvent(document, 'keydown').pipe(
      filter((event: KeyboardEvent) => '0123456789'.includes(event.key)),
      flatMap((event: KeyboardEvent) => event.key),
      scan((acc, char) => acc + char),
      debounceTime(500),
      first(),
      map(card => convertCard(card)),
      repeat()
    );

    this.cardStreamSub = this.cardStream.subscribe(result => this.card = result);
  }

  ngOnDestroy(): void {
    this.cardStreamSub.unsubscribe();
  }

  confirm() {
    this.activeModal.close(this.card);
  }

}
