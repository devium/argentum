import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {fromEvent, Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {convertCard} from '../utils';

@Component({
  selector: 'app-card-entry',
  templateUrl: './card-entry.component.html',
  styleUrls: ['./card-entry.component.scss']
})
export class CardEntryComponent implements OnInit, OnDestroy {

  convertCard = convertCard;

  card = '';
  keyboardSub: Subscription;
  activeModal: NgbActiveModal;
  callback = (card: string) => void (0);


  constructor() {
  }

  ngOnInit() {
    this.keyboardSub = fromEvent(document, 'keydown').pipe(
      filter((event: KeyboardEvent) => '0123456789'.includes(event.key) || event.key === 'Enter')
    ).subscribe(
      (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
          document.getElementById('confirm').focus();
        } else {
          document.getElementById('cardInput').focus();
        }
      }
    );
  }

  ngOnDestroy() {
    this.keyboardSub.unsubscribe();
  }

  confirm() {
    const card = convertCard(this.card);
    this.callback(card);
    if (this.activeModal) {
      this.activeModal.close(card);
    }
  }
}
