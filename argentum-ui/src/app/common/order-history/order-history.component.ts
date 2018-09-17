import { Component, Input, OnInit } from '@angular/core';
import { RestService } from '../rest-service/rest.service';
import { Guest } from '../model/guest';
import { Order } from '../model/order';
import { MessageComponent } from '../message/message.component';
import { OrderItem } from '../model/order-item';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KeypadModalComponent } from '../keypad-modal/keypad-modal.component';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  @Input()
  allowCancel: boolean;
  @Input()
  modal: boolean;
  @Input()
  message: MessageComponent;

  guest: Guest;
  orders: Order[];

  constructor(private restService: RestService, private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  getOrderHistory(guest: Guest) {
    this.guest = guest;
    this.restService.getOrders(guest)
      .then((orders: Order[]) => this.orders = orders.sort(
        (order1: Order, order2: Order) => order2.time.getTime() - order1.time.getTime())
      )
      .catch(reason => this.message.error(reason));
  }

  refresh() {
    if (this.guest) {
      this.getOrderHistory(this.guest);
    }
  }

  clear() {
    this.guest = null;
    this.orders = null;
  }

  cancelOrderItem(order: Order, orderItem: OrderItem) {
    const confirmModal = this.modalService.open(ConfirmModalComponent, { backdrop: 'static' });
    const confirmModalComponent = <ConfirmModalComponent>confirmModal.componentInstance;

    confirmModalComponent.message = `
      Are you sure you want to refund <b>${this.guest.name}</b>
      with <b>€${orderItem.product.price.toFixed(2)}</b>
      for one <b>${orderItem.product.name}?</b>
    `;

    confirmModal.result
      .then(() => {
        orderItem.cancelled += 1;
        order.update();
        this.restService.cancelOrderItem(orderItem)
          .then(() => {
            this.message.success(`
                Refunded <b>${this.guest.name}</b>
                with <b>€${orderItem.product.price.toFixed(2)}</b>
                for one <b>${orderItem.product.name}</b>.
            `);
          })
          .catch(reason => {
            this.message.error(reason);
            this.refresh();
          });
      })
      .catch(() => void(0));
  }

  cancelCustom(order: Order) {
    const keypadModal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });

    keypadModal.result
      .then((customCancelled: number) => {
        customCancelled = Math.min(customCancelled, order.customTotalEffective);
        const confirmModal = this.modalService.open(ConfirmModalComponent, { backdrop: 'static' });
        const confirmModalComponent = <ConfirmModalComponent>confirmModal.componentInstance;

        confirmModalComponent.message = `
          Are you sure you want to refund <b>${this.guest.name}</b>
          with <b>€${customCancelled.toFixed(2)}</b>
          for a custom order?
        `;

        confirmModal.result
          .then(() => {
            order.customCancelled += customCancelled;
            order.update();
            this.restService.cancelCustom(order)
              .then(() => {
                this.message.success(`
                  Refunded <b>${this.guest.name}</b>
                  with <b>€${customCancelled.toFixed(2)}</b>
                  for a custom order.
                `);
              })
              .catch(reason => {
                this.message.error(reason);
                this.refresh();
              });
          })
          .catch(() => void(0));
      })
      .catch(() => void(0));
  }

}
