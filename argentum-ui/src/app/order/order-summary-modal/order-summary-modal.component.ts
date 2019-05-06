import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Order} from '../../common/model/order';
import {OrderHistoryComponent} from '../../common/order-history/order-history.component';
import {Discount} from '../../common/model/discount';
import {isDarkBackground} from '../../common/utils';

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

  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.orderHistoryComponent.setSingleOrder(this.order);
  }

  confirm(): void {
    this.activeModal.close();
  }

}
