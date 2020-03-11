import {Component, OnInit, ViewChild} from '@angular/core';
import {MessageComponent} from '../common/message/message.component';
import {CardEntryComponent} from '../common/card-entry/card-entry.component';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {OrderHistoryModalComponent} from '../common/order/order-history-modal/order-history-modal.component';

@Component({
  selector: 'app-balance',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss']
})
export class ScanComponent implements OnInit {
  @ViewChild(CardEntryComponent, { static: true })
  cardEntry: CardEntryComponent;

  @ViewChild(MessageComponent, { static: true })
  message: MessageComponent;

  orderHistoryModal: NgbModalRef;

  constructor(private modalService: NgbModal) {
  }

  ngOnInit() {
    this.cardEntry.callback = (card: string) => {
      if (this.orderHistoryModal) {
        this.orderHistoryModal.close();
      }

      this.cardEntry.card = '';
      this.orderHistoryModal = this.modalService.open(OrderHistoryModalComponent);
      const orderHistoryModalComponent = <OrderHistoryModalComponent>this.orderHistoryModal.componentInstance;
      orderHistoryModalComponent.orderHistory.message = this.message;
      orderHistoryModalComponent.orderHistory.showTransactionsAndBalances = true;
      orderHistoryModalComponent.orderHistory.getOrderHistory(card);
    };
  }

}
