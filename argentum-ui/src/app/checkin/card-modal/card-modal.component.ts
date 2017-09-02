import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { convertCard } from '../../common/util/convert-card';

@Component({
  selector: 'app-card-modal',
  templateUrl: './card-modal.component.html',
  styleUrls: ['./card-modal.component.scss']
})
export class CardModalComponent implements OnInit {
  card: string;
  private cardStream: Observable<string>;

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.cardStream = Observable.fromEvent(document, 'keydown')
      .filter((event: KeyboardEvent) => '0123456789'.includes(event.key))
      .flatMap((event: KeyboardEvent) => event.key)
      .scan((acc, char) => acc + char)
      .debounceTime(500)
      .first()
      .map(card => convertCard(card))
      .repeat();

    this.cardStream.subscribe(result => this.card = result);
  }

  confirm() {
    this.activeModal.close(this.card);
  }

}
