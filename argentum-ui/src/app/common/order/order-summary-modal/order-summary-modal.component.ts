import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Order} from '../../model/order';
import {OrderHistoryComponent} from '../order-history/order-history.component';
import {Discount} from '../../model/discount';
import {isDarkBackground} from '../../utils';

@Component({
  selector: 'app-order-summary-modal',
  templateUrl: './order-summary-modal.component.html',
  styleUrls: ['./order-summary-modal.component.scss']
})
export class OrderSummaryModalComponent implements OnInit {
  isDarkBackground = isDarkBackground;

  order: Order;
  discounts: Discount[];

  @ViewChild(OrderHistoryComponent)
  orderHistoryComponent: OrderHistoryComponent;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.orderHistoryComponent.setSingleOrder(this.order);
  }

  confirm(): void {
    this.activeModal.close();
  }

}
