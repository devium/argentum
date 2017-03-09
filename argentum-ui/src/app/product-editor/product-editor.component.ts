import { Component, OnInit } from "@angular/core";
import { ProductRange } from "../product-range";
import { RestService } from "../rest-service/rest.service";
import { Category } from "../category";

@Component({
  selector: 'app-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrls: ['./product-editor.component.scss']
})
export class ProductEditorComponent implements OnInit {
  private activeRange: ProductRange;
  private productRanges: ProductRange[] = [];
  private categories: Category[] = [];

  constructor(private restService: RestService) {
  }

  ngOnInit(): void {
    this.restService.getProductRanges().then(ranges => this.productRanges = ranges);
    this.restService.getCategories().then(categories => this.categories = categories);
  }

  setActiveRange(range: ProductRange) {
    this.activeRange = range;
  }

  setCategory(product, category) {
    console.info('Category changed.'); // TODO
  }
}
