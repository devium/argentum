import { Component, OnInit, NgZone, EventEmitter, Output } from "@angular/core";
import { Product } from "../product";
import { RestService } from "../rest-service/rest.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { KeypadComponent } from "../keypad/keypad.component";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['order.component.scss']
})
export class OrderComponent implements OnInit {
  private rangeProductsPerPage;
  private orderProductsPerPage;
  private rangePage = 0;
  private orderPage = 0;
  private products: Product[] = [];
  private orderedProducts: Map<Product, number> = new Map<Product, number>();
  private total = 0;

  @Output()
  customProductEvent = new EventEmitter();

  constructor(private restService: RestService, private ngZone: NgZone, private modalService: NgbModal) {
    window.onresize = (event) => {
      this.ngZone.run(() => {
        if (window.innerWidth < 576) {
          this.rangeProductsPerPage = 14;
          this.orderProductsPerPage = 6;
        } else {
          this.rangeProductsPerPage = 35;
          this.orderProductsPerPage = 18;
        }
      });
    };
    window.onresize(null);
  }

  ngOnInit() {
    this.restService.getProducts().then(products => this.products = products);
  }

  private rangeProductClicked(product: Product): void {
    if (this.orderedProducts.has(product)) {
      this.orderedProducts.set(product, this.orderedProducts.get(product) + 1);
    } else {
      this.orderedProducts.set(product, 1);
    }
    this.updateTotal();
  }

  private orderedProductClicked(product: Product): void {
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
    let r = parseInt(color.substr(1, 2), 16);
    let g = parseInt(color.substr(3, 2), 16);
    let b = parseInt(color.substr(5, 2), 16);

    let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    return luminance < 128;
  }

  private addCustomProduct(): void {
    let modal = this.modalService.open(KeypadComponent, { backdrop: 'static', size: 'sm' });
    modal.result.then(result => this.confirmKeypad(result), result => void(0));
  }

  private confirmKeypad(price: number): void {
    this.orderedProducts.set({ id: -1, name: 'Custom', price: price, category: null, ranges: [] }, 1);
    this.updateTotal();
  }

  private updateTotal(): void {
    this.total = 0;
    this.orderedProducts.forEach((quantity: number, product: Product) => this.total += product.price * quantity);
  }
}
