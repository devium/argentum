import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductRange } from '../../common/model/product-range';
import { RestService } from '../../common/rest-service/rest.service';
import { Category } from '../../common/model/category';
import { Product } from '../../common/model/product';
import { isDarkBackground } from '../../common/util/is-dark-background';
import { KeypadModalComponent } from '../../common/keypad-modal/keypad-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageComponent } from '../../common/message/message.component';

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
    return !this.original || this.original.name != this.edited.name;
  }

  hasChangedPrice(): boolean {
    return !this.original || this.original.price != this.edited.price;
  }

  hasChangedCategory(): boolean {
    return !this.original || this.original.category != this.edited.category;
  }

  hasChangedRanges(): boolean {
    if (!this.original) {
      return true;
    }

    let equal: boolean = true;
    this.original.ranges.forEach(range => equal = equal && this.edited.ranges.has(range));
    this.edited.ranges.forEach(range => equal = equal && this.original.ranges.has(range));
    return !equal;
  }

  updateChanged(): void {
    this.changed = this.hasChangedName()
      || this.hasChangedPrice()
      || this.hasChangedCategory()
      || this.hasChangedRanges();
  }
}

@Component({
  selector: 'app-product-editor',
  templateUrl: 'product-editor.component.html',
  styleUrls: ['product-editor.component.scss']
})
export class ProductEditorComponent implements OnInit {
  private readonly PAGE_SIZE = 15;
  private page = 1;
  private products: EditorProduct[] = [];
  private productRanges: ProductRange[] = [];
  private categories: Category[] = [];

  @ViewChild(MessageComponent)
  private message: MessageComponent;

  constructor(private restService: RestService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts() {
    let pProducts = this.restService.getProducts()
      .then(products => this.products = products
        .map(product => new EditorProduct(product))
        .sort((a, b) => {
          let nameA = a.original.name.toLowerCase();
          let nameB = b.original.name.toLowerCase();
          if (nameA < nameB) {
            return -1;
          } else if (nameA > nameB) {
            return 1;
          }
          return 0;
        }));

    let pRanges = this.restService.getProductRangesMeta()
      .then(ranges => this.productRanges = ranges);

    let pCategories = this.restService.getCategories()
      .then(categories => this.categories = categories);

    Promise.all([pProducts, pRanges, pCategories])
      .catch(reason => this.message.error(`Error: ${reason}`))
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
    product.updateChanged();
  }

  private setProductPrice(product: EditorProduct) {
    let modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;
    modal.result.then((result: number) => {
      product.displayed.price = result;
      product.updateChanged();
    }, result => void(0));
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
    this.products.unshift(newProduct);
  }

  private resetAll() {
    this.products.forEach(product => {
      if (product.original) {
        this.reset(product);
      }
    });
    this.products = this.products.filter(product => product.original);
  }

  private save() {
    // Products with changed name or price will not be updated but instead recreated.
    let createdProducts = this.products
      .filter(product => product.edited && (product.hasChangedName() || product.hasChangedPrice()))
      .map(product => product.edited);
    let updatedProducts = this.products
      .filter(product => product.original && product.changed && !product.hasChangedName() && !product.hasChangedPrice())
      .map(product => product.edited);
    let deletedProducts = this.products
      .filter(product => product.original && (!product.edited || product.hasChangedName() || product.hasChangedPrice()))
      .map(product => product.original);

    let pCreate = this.restService.createProducts(createdProducts);
    let pUpdate = this.restService.updateProducts(updatedProducts);
    let pDelete = this.restService.deleteProducts(deletedProducts);

    Promise.all([pCreate, pUpdate, pDelete])
      .then(() => {
        this.message.success(`Products saved successfully. ${createdProducts.length} created, ${updatedProducts.length} updated, ${deletedProducts.length} deleted)`);
        this.loadProducts();
      })
      .catch(reason => this.message.error(`Error: ${reason}`))
  }
}
