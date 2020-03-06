import {Component, Input, OnInit} from '@angular/core';
import {Order} from '../model/order';
import {MessageComponent} from '../message/message.component';
import {OrderItem} from '../model/order-item';
import {ConfirmModalComponent} from '../confirm-modal/confirm-modal.component';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {KeypadModalComponent} from '../keypad-modal/keypad-modal.component';
import {BonusTransaction} from '../model/bonus-transaction';
import {Transaction} from '../model/transaction';
import {TransactionService} from '../rest-service/transaction.service';
import {BonusTransactionService} from '../rest-service/bonus-transaction.service';
import {OrderService} from '../rest-service/order.service';
import {combineLatest, of} from 'rxjs';
import {AbstractTimeModel} from '../model/abstract-model';
import {Guest} from '../model/guest';
import {GuestService} from '../rest-service/guest.service';
import {formatCurrency, formatDiscount, formatTime} from '../utils';
import {flatMap} from 'rxjs/operators';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  Transaction = Transaction;
  BonusTransaction = BonusTransaction;
  Order = Order;
  formatCurrency = formatCurrency;
  formatDiscount = formatDiscount;
  formatTime = formatTime;

  @Input()
  allowCancel: boolean;
  @Input()
  showTransactionsAndBalances: boolean;
  @Input()
  message: MessageComponent;
  @Input()
  activeModal: NgbActiveModal;

  card: string;
  guest: Guest;
  entries: AbstractTimeModel[] = null;

  constructor(
    private guestService: GuestService,
    private transactionService: TransactionService,
    private bonusTransactionService: BonusTransactionService,
    private orderService: OrderService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
  }

  instanceOf(value: any, clazz: any): boolean {
    return value instanceof clazz;
  }

  toTransaction(value: any): Transaction {
    return <Transaction>value;
  }

  toBonusTransaction(value: any): BonusTransaction {
    return <BonusTransaction>value;
  }

  toOrder(value: any): Order {
    return <Order>value;
  }

  error(error: string, close: boolean = false) {
    this.message.error(error);
    if (close && this.activeModal) {
      this.activeModal.dismiss();
    }
  }

  getOrderHistory(card: string) {
    this.card = card;
    if (this.showTransactionsAndBalances) {
      this.orderService.listByCard(card).pipe(
        flatMap((orders: Order[]) => {
          const transactions$ = this.transactionService.listByCard(card, orders);
          const bonusTransactions$ = this.bonusTransactionService.listByCard(card);
          return combineLatest(of(orders), transactions$, bonusTransactions$);
        })
      ).subscribe(
        ([orders, transactions, bonusTransactions]: [Order[], Transaction[], BonusTransaction[]]) => {
          this.entries = [];
          this.entries.push(...transactions.filter((transaction: Transaction) => transaction.order === null && !transaction.pending));
          this.entries.push(...bonusTransactions.filter((bonusTransaction: BonusTransaction) => !bonusTransaction.pending));
          this.entries.push(...orders.filter((order: Order) => !order.pending));
          this.entries.sort((a: AbstractTimeModel, b: AbstractTimeModel) => b.time.getTime() - a.time.getTime());
        },
        (error: string) => this.error(error, true)
      );

      this.guestService.retrieveByCard(card).subscribe(
        (guest: Guest) => this.guest = guest,
        (error: string) => this.error(error, true)
      );
    } else {
      this.orderService.listByCard(card).subscribe(
        (orders: Order[]) => {
          this.entries = orders.filter((order: Order) => !order.pending);
          this.entries.sort((a: AbstractTimeModel, b: AbstractTimeModel) => b.time.getTime() - a.time.getTime());
        },
        (error: string) => this.error(error, true)
      );
    }
  }

  setSingleOrder(order: Order) {
    this.entries = [order];
  }

  cancelOrderItem(order: Order, orderItem: OrderItem) {
    const confirmModal = this.modalService.open(ConfirmModalComponent, {backdrop: 'static'});
    const confirmModalComponent = <ConfirmModalComponent>confirmModal.componentInstance;

    confirmModalComponent.message = `
      Are you sure you want to refund <b>card #${this.card}</b>
      with <b>€${formatCurrency(orderItem.product.price * (1 - orderItem.discount))}</b>
      for one <b>${orderItem.product.name}?</b>
    `;

    confirmModal.result.then(
      () => {
        const products = [orderItem.product];
        this.orderService.cancelProduct(orderItem, orderItem.quantityCurrent - 1, products).subscribe(
          (orderItemResponse: OrderItem) => {
            this.message.success(`
                Refunded <b>card #${this.card}</b>
                with <b>€${formatCurrency(orderItem.product.price * (1 - orderItem.discount))}</b>
                for one <b>${orderItem.product.name}</b>.
            `);
            const index = order.orderItems.findIndex((findOrderItem: OrderItem) => findOrderItem.id === orderItemResponse.id);
            order.orderItems[index] = orderItemResponse;
          },
          (error: string) => this.error(error, true)
        );
      },
      (cancel: string) => void (0)
    );
  }

  cancelCustom(order: Order) {
    const keypadModal = this.modalService.open(KeypadModalComponent, {backdrop: 'static', size: 'sm'});

    keypadModal.result.then(
      (customCancelled: number) => {
        customCancelled = Math.min(customCancelled, order.customCurrent);
        const confirmModal = this.modalService.open(ConfirmModalComponent, {backdrop: 'static'});
        const confirmModalComponent = <ConfirmModalComponent>confirmModal.componentInstance;

        confirmModalComponent.message = `
          Are you sure you want to refund <b>card #${this.card}</b>
          with <b>€${formatCurrency(customCancelled)}</b>
          for a custom order?
        `;

        confirmModal.result.then(() => {
          // Get products to be used for resolution in the response.
          const products = order.orderItems.map((orderItem: OrderItem) => orderItem.product);
          this.orderService.cancelCustom(order, order.customCurrent - customCancelled, products).subscribe(
            (orderResponse: Order) => {
              this.message.success(`
                  Refunded <b>card #${this.card}</b>
                  with <b>€${formatCurrency(customCancelled)}</b>
                  for a custom order.
                `);
              const index = this.entries.findIndex((findOrder: Order) => findOrder.id === orderResponse.id);
              this.entries[index] = orderResponse;
            },
            (error: string) => this.error(error, true)
          );
        });
      },
      (cancel: string) => void (0)
    );
  }

}
