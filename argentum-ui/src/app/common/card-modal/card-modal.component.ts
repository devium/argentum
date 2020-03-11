import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {CardEntryComponent} from '../card-entry/card-entry.component';

@Component({
  selector: 'app-card-modal',
  templateUrl: './card-modal.component.html',
  styleUrls: ['./card-modal.component.scss']
})
export class CardModalComponent implements OnInit, OnDestroy {
  @ViewChild(CardEntryComponent, { static: true })
  cardEntry: CardEntryComponent;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.cardEntry.activeModal = this.activeModal;
  }

  ngOnDestroy(): void {
  }
}
