import {Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {Product} from '../../common/model/product';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {KeypadModalComponent} from '../../common/keypad-modal/keypad-modal.component';
import {ProductRange} from '../../common/model/product-range';
import {MessageComponent} from '../../common/message/message.component';
import {OrderHistoryModalComponent} from '../../common/order-history-modal/order-history-modal.component';
import {Category} from '../../common/model/category';
import {ProductRangeService} from '../../common/rest-service/product-range.service';
import {OrderService} from '../../common/rest-service/order.service';
import {CategoryService} from '../../common/rest-service/category.service';
import {Order} from '../../common/model/order';
import {OrderItem} from '../../common/model/order-item';
import {CardModalComponent} from '../../common/card-modal/card-modal.component';
import {formatCurrency, getPaginated, isDarkBackground} from '../../common/utils';
import {flatMap} from 'rxjs/operators';

@Component({
  selector: 'app-order',
  templateUrl: 'order.component.html',
  styleUrls: ['order.component.scss']
})
export class OrderComponent implements OnInit {
  isDarkBackground = isDarkBackground;
  formatCurrency = formatCurrency;
  getPaginated = getPaginated;

  rangeProductsPerPage: number;
  orderProductsPerPage: number;
  pagesShown: number;
  rangePage = 0;
  orderPage = 0;

  productRanges: ProductRange[] = [];
  selectedRange: ProductRange = null;
  orderItems: OrderItem[] = [];
  total = 0;
  waitingForOrder = false;

  @ViewChild(MessageComponent)
  message: MessageComponent;

  constructor(
    private productRangeService: ProductRangeService,
    private categoryService: CategoryService,
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

  getNumPadItems(count: number, pageSize: number, page: number): number {
    if (count === 0) {
      return pageSize;
    }
    if (count - pageSize * (page - 1) < pageSize) {
      return pageSize - count % pageSize;
    }
    return 0;
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

  placeOrder(): void {
    this.waitingForOrder = true;
    this.modalService.open(CardModalComponent, {backdrop: 'static', size: 'sm'}).result.then(
      (card: string) => {
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
        this.orderService.create(newOrder).pipe(
          flatMap((order: Order) => this.orderService.commit(order))
        ).subscribe(
          (committedOrder: Order) => {
            this.message.success(`Order placed for <b>card #${card}</b>`);
            this.clear();
            this.waitingForOrder = false;
          },
          (error: string) => {
            this.waitingForOrder = false;
            this.message.error(error);
          }
        );
      },
      (cancel: string) => this.waitingForOrder = false
    );
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
      (cancel: string) => void(0)
    );
  }
}
