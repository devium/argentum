import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/take';

@Component({
  selector: 'app-delete-guests-modal',
  templateUrl: './delete-guests-modal.component.html',
  styleUrls: ['./delete-guests-modal.component.scss']
})
export class DeleteGuestsModalComponent implements OnInit {
  countdown: number;

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.countdown = 5;
    Observable
      .timer(1000, 1000)
      .take(5)
      .subscribe(tick => this.countdown = 5 - tick - 1);
  }

}
