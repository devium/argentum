import { Component, OnInit } from "@angular/core";
import { Product } from "../product";
import { ProductService } from "../product.service";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['order.component.scss']
})
export class OrderComponent implements OnInit {
  private readonly RANGE_PRODUCTS_PER_PAGE = 30;
  private readonly ORDER_PRODUCTS_PER_PAGE = 15;
  private rangePage = 0;
  private orderPage = 0;
  private products: Product[] = [];
  private orderedProducts: Map<Product, number> = new Map<Product, number>();

  constructor(private productService: ProductService) {
  }

  ngOnInit() {
    this.productService.getProducts().then(products => this.products = products);
  }

  private rangeProductClicked(product: Product): void {
    if (this.orderedProducts.has(product)) {
      this.orderedProducts.set(product, this.orderedProducts.get(product) + 1);
    } else {
      this.orderedProducts.set(product, 1);
    }
  }

  private orderedProductClicked(product: Product): void {
    let count = this.orderedProducts.get(product);
    if (count == 1) {
      this.orderedProducts.delete(product);
    } else {
      this.orderedProducts.set(product, count - 1);
    }
  }

  private getPaginated(data: any, pageSize: number, page: number): Product[] {
    return data.slice(pageSize * (page - 1), pageSize * page);
  }

  getNumPadItems(count: number, pageSize: number, page: number): number {
    if (count == 0) {
      return pageSize;
    }
    if (count - pageSize * (page - 1) < pageSize) {
      let a = pageSize - count % pageSize;
      return a;
    }
    return 0;
  }

  private range(n: number): number[] {
    let range = [];
    for (let i = 0; i < n; i++) {
      range.push(i);
    }
    return range;
  }

  private isDarkBackground(color: string): boolean {
    let r = parseInt(color.substr(1, 2), 16);
    let g = parseInt(color.substr(3, 2), 16);
    let b = parseInt(color.substr(5, 2), 16);

    let luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    return luminance < 128;
  }

}
