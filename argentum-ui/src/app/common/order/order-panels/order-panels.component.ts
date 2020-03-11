import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {Product} from '../../model/product';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {KeypadModalComponent} from '../../keypad-modal/keypad-modal.component';
import {ProductRange} from '../../model/product-range';
import {MessageComponent} from '../../message/message.component';
import {OrderHistoryModalComponent} from '../order-history-modal/order-history-modal.component';
import {Category} from '../../model/category';
import {ProductRangeService} from '../../rest-service/product-range.service';
import {OrderService} from '../../rest-service/order.service';
import {CategoryService} from '../../rest-service/category.service';
import {Order} from '../../model/order';
import {OrderItem} from '../../model/order-item';
import {CardModalComponent} from '../../card-modal/card-modal.component';
import {formatCurrency, getPaddingItemCount, getPaginated, isDarkBackground} from '../../utils';
import {OrderSummaryModalComponent} from '../order-summary-modal/order-summary-modal.component';
import {DiscountService} from '../../rest-service/discount.service';
import {combineLatest, from, Observable, of, throwError} from 'rxjs';
import {Discount} from '../../model/discount';
import {catchError, flatMap, map} from 'rxjs/operators';

@Component({
  selector: 'app-order-panels',
  templateUrl: 'order-panels.component.html',
  styleUrls: ['order-panels.component.scss']
})
export class OrderPanelsComponent implements OnInit {
  isDarkBackground = isDarkBackground;
  formatCurrency = formatCurrency;
  getPaginated = getPaginated;
  getPaddingItemCount = getPaddingItemCount;

  orderCreationCallback = (card: string, order: Order) => {
  };

  rangeProductsPerPage: number;
  orderProductsPerPage: number;
  pagesShown: number;
  rangePage = 0;
  orderPage = 0;

  productRanges: ProductRange[] = [];
  selectedRange: ProductRange = null;
  orderItems: OrderItem[] = [];
  total = 0;
  commitOrders = true;

  @ViewChild(MessageComponent, { static: true })
  message: MessageComponent;

  constructor(
    private productRangeService: ProductRangeService,
    private categoryService: CategoryService,
    private discountService: DiscountService,
    private orderService: OrderService,
    private ngZone: NgZone,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this.onResize(window);
    this.refreshRanges();
    this.refreshProducts();
  }

  onResize(newWindow: Window): void {
    if (newWindow.innerWidth < 576) {
      this.rangeProductsPerPage = 13;
      this.orderProductsPerPage = 4;
      this.pagesShown = 5;
    } else if (newWindow.innerWidth < 768) {
      this.rangeProductsPerPage = 23;
      this.orderProductsPerPage = 4;
      this.pagesShown = 10;
    } else {
      this.rangeProductsPerPage = 27;
      this.orderProductsPerPage = 14;
      this.pagesShown = 10;
    }
  }

  refreshRanges() {
    this.productRangeService.list().subscribe(
      (ranges: ProductRange[]) => {
        this.productRanges = ranges;
        if (ranges.length === 1) {
          this.setProductRange(ranges[0]);
        }
      },
      (error: string) => this.message.error(error)
    );
  }

  refreshProducts() {
    if (this.selectedRange) {
      this.categoryService.list().subscribe(
        (categories: Category[]) => {
          this.productRangeService.retrieve(this.selectedRange.id, categories).subscribe(
            (productRange: ProductRange) => {
              this.selectedRange = productRange;
            },
            (error: string) => this.message.error(error)
          );
        },
        (error: string) => this.message.error(error)
      );
    }
  }

  updateTotal() {
    this.total = this.orderItems
      .map((orderItem: OrderItem) => orderItem.quantityInitial * orderItem.product.price)
      .reduce((a: number, b: number) => a + b, 0);
  }

  setProductRange(range: ProductRange) {
    this.selectedRange = range;
    this.refreshProducts();
  }

  rangeProductClicked(product: Product) {
    const existingItem = this.orderItems.find((orderItem: OrderItem) => orderItem.product.id === product.id);
    if (existingItem) {
      existingItem.quantityInitial += 1;
    } else {
      this.orderItems.push(new OrderItem(undefined, product, 1, undefined, undefined));
    }
    this.updateTotal();
  }

  orderItemClicked(orderItem: OrderItem) {
    if (orderItem.quantityInitial === 1) {
      const index = this.orderItems.indexOf(orderItem);
      this.orderItems.splice(index, 1);
    } else {
      orderItem.quantityInitial -= 1;
    }
    this.updateTotal();
  }

  addCustomProduct(): void {
    const modal = this.modalService.open(KeypadModalComponent, {backdrop: 'static', size: 'sm'});
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;
    modal.result.then(
      (price: number) => {
        this.orderItems.push(new OrderItem(undefined, new Product(undefined, 'Custom', false, price, null, []), 1, undefined, undefined));
        this.updateTotal();
      },
      (cancel: string) => void (0)
    );
  }

  clear(): void {
    this.orderItems = [];
    this.updateTotal();
  }

  canPlace(): boolean {
    return this.orderItems.length > 0;
  }

  placeOrder(): void {
    const cardModal = this.modalService.open(CardModalComponent, {backdrop: 'static', size: 'sm'});
    const cardOrder$ = from(cardModal.result).pipe(
      flatMap((card: string) => {
        const custom = this.orderItems
          .filter((orderItem: OrderItem) => orderItem.product.id === undefined)
          .map((orderItem: OrderItem) => orderItem.product.price * orderItem.quantityInitial)
          .reduce((a: number, b: number) => a + b, 0);
        const newOrder = new Order(
          undefined,
          undefined,
          undefined,
          card,
          custom,
          undefined,
          undefined,
          this.orderItems.filter((orderItem: OrderItem) => orderItem.product.id !== undefined)
        );

        const createdOrder$ = this.orderService.create(newOrder, this.selectedRange ? this.selectedRange.products : []);
        const discounts$ = this.discountService.listByCard(card);

        return combineLatest(of(card), createdOrder$, discounts$);
      }),
      flatMap(([card, order, discounts]: [string, Order, Discount[]]) => {
        const modal = this.modalService.open(OrderSummaryModalComponent, {backdrop: 'static'});
        const orderSummaryModalComponent = <OrderSummaryModalComponent>modal.componentInstance;
        orderSummaryModalComponent.order = order;
        orderSummaryModalComponent.discounts = discounts;
        orderSummaryModalComponent.orderHistoryComponent.message = this.message;
        return combineLatest(of(card), of(order), from(modal.result));
      }),
      flatMap(([card, order, result]: [string, Order, any]) => {
        if (this.commitOrders) {
          return combineLatest(of(card), this.orderService.commit(order));
        } else {
          return combineLatest(of(card), of(order));
        }
      })
    );

    cardOrder$.subscribe(([card, order]: [string, Order]) => {
        if (this.commitOrders) {
          this.message.success(`Order placed for <b>card #${card}</b>`);
        } else {
          this.orderCreationCallback(card, order);
        }
        this.clear();
      },
      (error: string) => {
        if (error !== 'Cancel click') {
          this.message.error(error);
        }
      });
  }

  showOrderHistory() {
    this.modalService.open(CardModalComponent, {backdrop: 'static', size: 'sm'}).result.then(
      (card: string) => {
        const orderHistoryModal = this.modalService.open(
          OrderHistoryModalComponent, {backdrop: 'static'}
        );
        const orderHistoryModalComponent = <OrderHistoryModalComponent>orderHistoryModal.componentInstance;
        orderHistoryModalComponent.orderHistory.message = this.message;
        orderHistoryModalComponent.orderHistory.allowCancel = true;
        orderHistoryModalComponent.orderHistory.getOrderHistory(card);
      },
      (cancel: string) => void (0)
    );
  }
}
