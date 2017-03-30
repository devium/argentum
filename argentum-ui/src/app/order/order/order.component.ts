import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../common/model/product';
import { RestService } from '../../common/rest-service/rest.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KeypadModalComponent } from '../../common/keypad-modal/keypad-modal.component';
import { isDarkBackground } from '../../common/util/is-dark-background';
import { ProductRange } from '../../common/model/product-range';
import { MessageComponent } from '../../common/message/message.component';
import { CardBarComponent } from '../../common/card-bar/card-bar.component';
import { Order } from '../../common/model/order';
import { OrderResponse } from '../../common/rest-service/response/order-response';

@Component({
  selector: 'app-order',
  templateUrl: 'order.component.html',
  styleUrls: ['order.component.scss']
})
export class OrderComponent implements OnInit {
  productRanges: ProductRange[] = [];
  selectedRange: ProductRange = null;
  rangeProductsPerPage: number;
  orderProductsPerPage: number;
  pagesShown: number;
  rangePage = 0;
  orderPage = 0;
  products: Product[] = [];
  orderedProducts: Map<Product, number> = new Map<Product, number>();
  total = 0;
  waitingForOrder = false;

  @ViewChild(MessageComponent)
  message: MessageComponent;

  @ViewChild(CardBarComponent)
  cardBar: CardBarComponent;

  constructor(private restService: RestService, private ngZone: NgZone, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.onResize(window);
    this.refreshRanges();
    this.refreshProducts();
  }

  onResize(newWindow: Window): void {
    if (newWindow.innerWidth < 576) {
      this.rangeProductsPerPage = 14;
      this.orderProductsPerPage = 6;
      this.pagesShown = 5;
    } else if (newWindow.innerWidth < 768) {
      this.rangeProductsPerPage = 23;
      this.orderProductsPerPage = 12;
      this.pagesShown = 10;
    } else if (newWindow.innerWidth < 992) {
      this.rangeProductsPerPage = 17;
      this.orderProductsPerPage = 9;
      this.pagesShown = 10;
    } else {
      this.rangeProductsPerPage = 35;
      this.orderProductsPerPage = 18;
      this.pagesShown = 10;
    }
  }

  refreshRanges() {
    this.restService.getProductRanges()
      .then((ranges: ProductRange[]) => {
        this.productRanges = ranges;
        if (ranges.length == 1) {
          this.setProductRange(ranges[0]);
        }
      })
      .catch(reason => this.message.error(`Error: ${reason}`));
  }

  refreshProducts() {
    if (this.selectedRange) {
      this.restService.getProductRange(this.selectedRange)
        .then((range: ProductRange) => this.products = range.products)
        .catch(reason => this.message.error(`Error: ${reason}`));
    }
  }

  updateTotal() {
    this.total = 0;
    this.orderedProducts.forEach((quantity: number, product: Product) => this.total += product.price * quantity);
  }

  setProductRange(range: ProductRange) {
    this.selectedRange = range;
    this.refreshProducts();
  }

  rangeProductClicked(product: Product) {
    if (this.orderedProducts.has(product)) {
      this.orderedProducts.set(product, this.orderedProducts.get(product) + 1);
    } else {
      this.orderedProducts.set(product, 1);
    }
    this.updateTotal();
  }

  orderedProductClicked(product: Product) {
    let count = this.orderedProducts.get(product);
    if (count == 1) {
      this.orderedProducts.delete(product);
    } else {
      this.orderedProducts.set(product, count - 1);
    }
    this.updateTotal();
  }

  getPaginated(data: any[], pageSize: number, page: number): Product[] {
    return data.slice(pageSize * (page - 1), pageSize * page);
  }

  getNumPadItems(count: number, pageSize: number, page: number): number {
    if (count == 0) {
      return pageSize;
    }
    if (count - pageSize * (page - 1) < pageSize) {
      return pageSize - count % pageSize;
    }
    return 0;
  }

  isDarkBackground(color: string): boolean {
    return isDarkBackground(color);
  }

  addCustomProduct(): void {
    let modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    modal.result.then(result => this.confirmKeypad(result), result => void(0));
  }

  confirmKeypad(price: number) {
    this.orderedProducts.set({
      id: -1,
      name: 'Custom',
      price: price,
      category: null,
      ranges: new Set(),
      legacy: false
    }, 1);
    this.updateTotal();
  }

  onRangeSwipeLeft() {
    this.rangePage = Math.min(Math.ceil(this.products.length / this.rangeProductsPerPage), this.rangePage + 1);
  }

  onRangeSwipeRight() {
    this.rangePage = Math.max(0, this.rangePage - 1);
  }

  onOrderSwipeLeft() {
    this.orderPage = Math.min(Math.ceil(this.orderedProducts.size / this.orderProductsPerPage), this.orderPage + 1);
  }

  onOrderSwipeRight() {
    this.orderPage = Math.max(0, this.rangePage - 1);
  }

  clear(): void {
    this.orderedProducts.clear();
    this.updateTotal();
  }

  placeOrder(): void {
    this.waitingForOrder = true;
    let order: Order = {
      guest: this.cardBar.guest,
      products: this.orderedProducts
    };
    this.restService.placeOrder(order)
      .then((response: OrderResponse) => {
        this.message.success(`Order placed for "${response.guest.name}". Total: €${response.total.toFixed(2)}. Remaining balance: €${response.guest.balance.toFixed(2)} (+ €${response.guest.bonus.toFixed(2)})`);
        this.orderedProducts.clear();
        this.updateTotal();
        this.waitingForOrder = false;
      })
      .catch(reason => {
        this.message.error(`Error: ${reason}`);
        this.waitingForOrder = false;
      });
  }
}
