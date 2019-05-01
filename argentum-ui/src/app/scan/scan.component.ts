import {Component, OnInit, ViewChild} from '@angular/core';
import {MessageComponent} from '../common/message/message.component';
import {CardEntryComponent} from '../common/card-entry/card-entry.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {OrderHistoryModalComponent} from '../common/order-history-modal/order-history-modal.component';

@Component({
  selector: 'app-balance',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss']
})
export class ScanComponent implements OnInit {
  @ViewChild(CardEntryComponent)
  cardEntry: CardEntryComponent;

  @ViewChild(MessageComponent)
  message: MessageComponent;

  constructor(private modalService: NgbModal) {
  }

  ngOnInit() {
    this.cardEntry.callback = (card: string) => {
      this.cardEntry.card = '';
      const orderHistoryModal = this.modalService.open(OrderHistoryModalComponent);
      const orderHistoryModalComponent = <OrderHistoryModalComponent>orderHistoryModal.componentInstance;
      orderHistoryModalComponent.orderHistory.message = this.message;
      orderHistoryModalComponent.orderHistory.showTransactionsAndBalances = true;
      orderHistoryModalComponent.orderHistory.getOrderHistory(card);
    };
  }

}
