import { Component, OnInit } from "@angular/core";
import { Product } from "../product";
import { ProductService } from "../product.service";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: [ 'order.component.scss' ]
})
export class OrderComponent implements OnInit {
  products: Product[];

  constructor(private productService: ProductService) {
  }

  ngOnInit() {
    this.productService.getProducts().then(products => this.products = products);
  }

}
