import { Component, OnInit } from "@angular/core";
import { ProductRange } from "../product-range";
import { RestService } from "../rest-service/rest.service";
import { Category } from "../category";
import { Product } from "../product";
import { isDarkBackground } from "../is-dark-background";
import { KeypadComponent } from "../keypad/keypad.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

class EditorProduct {
  original: Product;
  edited: Product;
  displayed: Product;
  changed: boolean = false;

  constructor(original: Product) {
    this.original = Object.assign({}, original);
    this.original.ranges = new Set(original.ranges);
    this.edited = Object.assign({}, original);
    this.edited.ranges = new Set(original.ranges);
    this.displayed = this.edited;
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

  hasChangedRanges(): boolean {
    let equal: boolean = true;
    this.original.ranges.forEach(range => equal = equal && this.edited.ranges.has(range));
    this.edited.ranges.forEach(range => equal = equal && this.original.ranges.has(range));
    return !equal;
  }

  updateChanged(): void {
    this.changed = !this.original
      || this.hasChangedName()
      || this.hasChangedPrice()
      || this.hasChangedCategory()
      || this.hasChangedRanges();
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

  constructor(private restService: RestService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.restService.getProducts().then(products => this.products = products.map(product => new EditorProduct(product)));
    this.restService.getProductRangesMeta().then(ranges => this.productRanges = ranges);
    this.restService.getCategories().then(categories => this.categories = categories);
  }

  private setCategory(product: EditorProduct, category: Category) {
    product.edited.category = category;
    product.updateChanged();
  }

  private toggleRange(product: EditorProduct, range: ProductRange) {
    if (product.edited.ranges.has(range)) {
      product.edited.ranges.delete(range);
    } else {
      product.edited.ranges.add(range);
    }
    product.updateChanged();
  }

  private isDarkBackground(color: string): boolean {
    return isDarkBackground(color);
  }

  private reset(product: EditorProduct) {
    product.edited = Object.assign({}, product.original);
    product.edited.ranges = new Set(product.original.ranges);
    product.displayed = product.edited;
    product.updateChanged();
  }

  private remove(product: EditorProduct) {
    if (product.original) {
      product.edited = null;
      product.displayed = product.original;
    } else {
      this.products.splice(this.products.indexOf(product), 1);
    }
  }

  private changeName(product: EditorProduct, value: string) {
    product.displayed.name = value;
    product.updateChanged();
  }

  private setProductPrice(product: EditorProduct) {
    let modal = this.modalService.open(KeypadComponent, { backdrop: 'static', size: 'sm' });
    (<KeypadComponent>modal.componentInstance).captureKeyboard = true;
    modal.result.then((result: number) => {
      product.displayed.price = result;
      product.updateChanged();
    }, result => void(0));
  }

  private changePrice(product: EditorProduct, value: string) {
    product.updateChanged();
  }

  private newProduct() {
    let newProduct = new EditorProduct({
      id: -1,
      name: "New Product",
      price: 0.00,
      category: null,
      ranges: new Set(),
      legacy: false
    });
    newProduct.original = null;
    newProduct.updateChanged();
    this.products.push(newProduct);
  }

  private resetAll() {
    this.products.forEach(product => {
      if (product.original) {
        this.reset(product);
      } else {
        this.remove(product);
      }
    });
  }

  private save() {
    let changedProducts = this.products
      .filter(product => product.changed)
      .map(product => product.edited);
    let deletedProducts = this.products
      .filter(product => !product.edited)
      .map(product => product.original);

    this.restService.saveProducts(changedProducts);
    this.restService.deleteProducts(deletedProducts);
  }
}
