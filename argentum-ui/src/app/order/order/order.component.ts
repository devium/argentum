import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { Product } from '../../common/model/product';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KeypadModalComponent } from '../../common/keypad-modal/keypad-modal.component';
import { isDarkBackground } from '../../common/util/is-dark-background';
import { ProductRange } from '../../common/model/product-range';
import { MessageComponent } from '../../common/message/message.component';
import { CardBarComponent } from '../../common/card-bar/card-bar.component';
import { OrderHistoryModalComponent } from '../order-history-modal/order-history-modal.component';
import { Category } from '../../common/model/category';

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
  categories = new Map<number, Category>();
  products: Product[] = [];
  orderedProducts = new Map<Product, number>();
  total = 0;
  waitingForOrder = false;

  @ViewChild(MessageComponent)
  message: MessageComponent;

  @ViewChild(CardBarComponent)
  cardBar: CardBarComponent;

  constructor(private ngZone: NgZone, private modalService: NgbModal) {
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
    // TODO
    // this.restService.getProductRanges()
    Promise.resolve([])
      .then((ranges: ProductRange[]) => {
        this.productRanges = ranges;
        if (ranges.length === 1) {
          this.setProductRange(ranges[0]);
        }
      })
      .catch(reason => this.message.error(reason));
  }

  refreshProducts() {
    if (this.selectedRange) {
      // TODO
      // const pProducts = this.restService.getRangeProducts(this.selectedRange);
      // const pCategories = this.restService.getCategories();
      Promise.all([])
        .then((response: any[]) => {
          const products: Product[] = response[0];
          const categories: Category[] = response[1];

          this.categories = new Map<number, Category>(categories.map(
            (category: Category) => [category.id, category] as [number, Category]
          ));

          this.products = products.filter(product => !product.deprecated);
          this.products.sort((a: Product, b: Product) => {
            const categoryA: string = a.category === null ? '' : this.categories.get(a.category.id).name;
            const categoryB: string = b.category === null ? '' : this.categories.get(b.category.id).name;
            return categoryA.localeCompare(categoryB);
          });
        })
        .catch(reason => this.message.error(reason));
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
    const count = this.orderedProducts.get(product);
    if (count === 1) {
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
    if (count === 0) {
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
    const modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    modal.result.then(result => this.confirmKeypad(result), result => void(0));
  }

  confirmKeypad(price: number) {
    this.orderedProducts.set(new Product(undefined, 'Custom', false, price, null, []), 1);
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
    this.cardBar.active = false;
    const guest = this.cardBar.guest;
    // TODO
    // this.restService.placeOrder(guest, this.orderedProducts)
    Promise.resolve()
      .then(() => {
        this.message.success(`
          Order placed for <b>${guest.name}</b>.
        `);
        this.orderedProducts.clear();
        this.updateTotal();
        this.waitingForOrder = false;
        this.cardBar.active = true;
        this.cardBar.reset();
      })
      .catch(reason => {
        this.message.error(reason);
        this.waitingForOrder = false;
        this.cardBar.active = true;
      });
  }

  showOrderHistory() {
    const modal = this.modalService.open(
      OrderHistoryModalComponent, { backdrop: 'static', windowClass: 'history-modal' }
    );
    const orderHistoryModal = (<OrderHistoryModalComponent>modal.componentInstance);
    orderHistoryModal.orderHistory.message = this.message;
    orderHistoryModal.orderHistory.getOrderHistory(this.cardBar.guest);
  }
}
