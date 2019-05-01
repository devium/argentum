import {Component, OnInit, ViewChild} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderHistoryComponent } from '../order-history/order-history.component';

@Component({
  selector: 'app-order-history-modal',
  templateUrl: './order-history-modal.component.html',
  styleUrls: ['./order-history-modal.component.scss']
})
export class OrderHistoryModalComponent implements OnInit {
  @ViewChild(OrderHistoryComponent)
  orderHistory: OrderHistoryComponent;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

}
