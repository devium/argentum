
import {timer as observableTimer, Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {map, take} from 'rxjs/operators';

@Component({
  selector: 'app-delete-guests-modal',
  templateUrl: './delete-guests-modal.component.html',
  styleUrls: ['./delete-guests-modal.component.scss']
})
export class DeleteGuestsModalComponent implements OnInit, OnDestroy {
  readonly TIMEOUT_SECONDS = 5;
  countdown = 5;
  subscription: Subscription;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.subscription = observableTimer(0, 1000).pipe(
        map((i: number) => this.TIMEOUT_SECONDS - i),
        take(this.TIMEOUT_SECONDS + 1)
      ).subscribe((tick: number) => this.countdown = tick);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
