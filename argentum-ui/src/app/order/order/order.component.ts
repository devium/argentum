import { Component, NgZone, OnInit } from '@angular/core';
import { Product } from '../../common/model/product';
import { RestService } from '../../common/rest-service/rest.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KeypadModalComponent } from '../../common/keypad-modal/keypad-modal.component';
import { isDarkBackground } from '../../common/util/is-dark-background';
import { ProductRange } from '../../common/model/product-range';

@Component({
  selector: 'app-order',
  templateUrl: 'order.component.html',
  styleUrls: ['order.component.scss']
})
export class OrderComponent implements OnInit {
  private productRanges: ProductRange[] = [];
  private selectedRange: ProductRange = null;
  private rangeProductsPerPage;
  private orderProductsPerPage;
  private rangePage = 0;
  private orderPage = 0;
  private products: Product[] = [];
  private orderedProducts: Map<Product, number> = new Map<Product, number>();
  private total = 0;
  private pagesShown = 3;

  constructor(private restService: RestService, private ngZone: NgZone, private modalService: NgbModal) {
    window.onresize = () => {
      this.ngZone.run(() => {
        if (window.outerWidth < 576) {
          this.rangeProductsPerPage = 14;
          this.orderProductsPerPage = 6;
          this.pagesShown = 5;
        } else if (window.outerWidth < 768) {
          this.rangeProductsPerPage = 23;
          this.orderProductsPerPage = 12;
          this.pagesShown = 10;
        } else if (window.outerWidth < 992) {
          this.rangeProductsPerPage = 17;
          this.orderProductsPerPage = 9;
          this.pagesShown = 10;
        } else {
          this.rangeProductsPerPage = 35;
          this.orderProductsPerPage = 18;
          this.pagesShown = 10;
        }
      });
    };
    window.onresize(null);
  }

  ngOnInit() {
    this.restService.getProductRangesMeta().then(ranges => this.productRanges = ranges);
  }

  private setProductRange(range: ProductRange) {
    this.selectedRange = range;
    this.refreshProducts();
  }

  private rangeProductClicked(product: Product) {
    if (this.orderedProducts.has(product)) {
      this.orderedProducts.set(product, this.orderedProducts.get(product) + 1);
    } else {
      this.orderedProducts.set(product, 1);
    }
    this.updateTotal();
  }

  private orderedProductClicked(product: Product) {
    let count = this.orderedProducts.get(product);
    if (count == 1) {
      this.orderedProducts.delete(product);
    } else {
      this.orderedProducts.set(product, count - 1);
    }
    this.updateTotal();
  }

  private getPaginated(data: any, pageSize: number, page: number): Product[] {
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

  private isDarkBackground(color: string): boolean {
    return isDarkBackground(color);
  }

  private addCustomProduct(): void {
    let modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = false;
    modal.result.then(result => this.confirmKeypad(result), result => void(0));
  }

  private confirmKeypad(price: number) {
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

  private updateTotal() {
    this.total = 0;
    this.orderedProducts.forEach((quantity: number, product: Product) => this.total += product.price * quantity);
  }

  private refreshProducts() {
    this.restService.getProductRangeEager(this.selectedRange.id).then(range => this.products = range.products);
  }

  private onRangeSwipe(event: any) {
    if (event.direction == 2) {
      this.rangePage = Math.min(Math.ceil(this.products.length / this.rangeProductsPerPage), this.rangePage + 1);
    } else if (event.direction == 4) {
      this.rangePage = Math.max(0, this.rangePage - 1);
    }
  }

  private onOrderSwipe(event: any) {
    if (event.direction == 2) {
      this.orderPage = Math.min(Math.ceil(this.orderedProducts.size / this.orderProductsPerPage), this.orderPage + 1);
    } else if (event.direction == 4) {
      this.orderPage = Math.max(0, this.rangePage - 1);
    }
  }
}
