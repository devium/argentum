import { Component, OnInit } from "@angular/core";
import { Product } from "../product";
import { ProductService } from "../product.service";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['order.component.scss']
})
export class OrderComponent implements OnInit {
  private readonly RANGE_PRODUCTS_PER_PAGE = 24;
  private readonly ORDER_PRODUCTS_PER_PAGE = 12;
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
    console.info(this.orderedProducts.size);
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
    console.info("Count: %s", count);
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

}
