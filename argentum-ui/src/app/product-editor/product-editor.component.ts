import { Component, OnInit } from '@angular/core';
import { ProductRange } from '../product-range';
import { RestService } from '../rest-service/rest.service';
import { Category } from '../category';
import { Product } from '../product';
import { isDarkBackground } from '../is-dark-background';

class EditorProduct {
  original: Product;
  edited: Product;

  constructor(original: Product) {
    this.original = Object.assign({}, original);
    this.edited = Object.assign({}, original);
  }

  hasChangedName(): boolean {
    return this.original.name != this.edited.name;
  }

  hasChangedPrice(): boolean {
    return this.original.price != this.edited.price;
  }

  hasChangedCategory(): boolean {
    return this.original.category != this.edited.category;
  }

  hasChanged(): boolean {
    return this.hasChangedName()
      || this.hasChangedPrice()
      || this.hasChangedCategory();
  }
}

@Component({
  selector: 'app-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrls: ['./product-editor.component.scss']
})
export class ProductEditorComponent implements OnInit {
  private products: EditorProduct[];
  private productRanges: ProductRange[] = [];
  private categories: Category[] = [];

  constructor(private restService: RestService) {
  }

  ngOnInit(): void {
    this.restService.getProducts().then(products => this.products = products.map(product => new EditorProduct(product)));
    this.restService.getProductRangesMeta().then(ranges => this.productRanges = ranges);
    this.restService.getCategories().then(categories => this.categories = categories);
  }

  setCategory(product: EditorProduct, category: Category) {
    product.edited.category = category;
  }

  isDarkBackground(color: string): boolean {
    return isDarkBackground(color);
  }
}
