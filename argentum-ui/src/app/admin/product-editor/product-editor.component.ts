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
  changed = false;

  constructor(original: Product) {
    this.original = Object.assign({}, original);
    this.original.rangeIds = new Set(original.rangeIds);
    this.edited = Object.assign({}, original);
    this.edited.rangeIds = new Set(original.rangeIds);
    this.displayed = this.edited;
  }

  hasChangedName(): boolean {
    return !this.original || this.original.name !== this.edited.name;
  }

  hasChangedPrice(): boolean {
    return !this.original || this.original.price !== this.edited.price;
  }

  hasChangedCategory(): boolean {
    return !this.original || this.original.categoryId !== this.edited.categoryId;
  }

  hasChangedRanges(): boolean {
    if (!this.original) {
      return true;
    }

    let equal = true;
    this.original.rangeIds.forEach((rangeId: number) => equal = equal && this.edited.rangeIds.has(rangeId));
    this.edited.rangeIds.forEach((rangeId: number) => equal = equal && this.original.rangeIds.has(rangeId));
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
  readonly PAGE_SIZE = 12;
  page = 1;
  products: EditorProduct[] = [];
  productRanges: ProductRange[] = [];
  categories: Category[] = [];

  @ViewChild(MessageComponent)
  message: MessageComponent;

  constructor(private restService: RestService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.restService.getProductData()
      .then((productData: { products: Product[], categories: Category[], ranges: ProductRange[] }) => {
        this.categories = productData.categories;
        this.productRanges = productData.ranges;
        this.products = productData.products
          .map(product => new EditorProduct(product))
          .sort((a, b) => {
            const nameA = a.original.name.toLowerCase();
            const nameB = b.original.name.toLowerCase();
            if (nameA < nameB) {
              return -1;
            } else if (nameA > nameB) {
              return 1;
            }
            return 0;
          });
      })
      .catch(reason => this.message.error(reason));
  }

  setCategory(product: EditorProduct, categoryId: number) {
    product.edited.categoryId = categoryId;
    product.updateChanged();
  }

  toggleRange(product: EditorProduct, range: ProductRange) {
    if (product.edited.rangeIds.has(range.id)) {
      product.edited.rangeIds.delete(range.id);
    } else {
      product.edited.rangeIds.add(range.id);
    }
    product.updateChanged();
  }

  isDarkBackground(color: string): boolean {
    return isDarkBackground(color);
  }

  reset(product: EditorProduct) {
    product.edited = Object.assign({}, product.original);
    product.edited.rangeIds = new Set(product.original.rangeIds);
    product.displayed = product.edited;
    product.updateChanged();
  }

  remove(product: EditorProduct) {
    if (product.original) {
      product.edited = null;
      product.displayed = product.original;
    } else {
      this.products.splice(this.products.indexOf(product), 1);
    }
  }

  changeName(product: EditorProduct, value: string) {
    product.updateChanged();
  }

  setProductPrice(product: EditorProduct) {
    const modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;
    modal.result.then((result: number) => {
      product.displayed.price = result;
      product.updateChanged();
    }, result => void(0));
  }

  newProduct() {
    const newProduct = new EditorProduct({
      id: -1,
      name: 'New Product',
      price: 0.00,
      categoryId: null,
      rangeIds: new Set(),
      legacy: false
    });
    newProduct.original = null;
    newProduct.updateChanged();
    this.products.unshift(newProduct);
  }

  resetAll() {
    this.products.forEach(product => {
      if (product.original) {
        this.reset(product);
      }
    });
    this.products = this.products.filter(product => product.original);
  }

  save() {
    // Products with changed name or price will not be updated but instead recreated.
    const mergedProducts = this.products
      .filter(product => product.edited && product.changed)
      .map(product => product.edited);
    const deletedProducts = this.products
      .filter(product => !product.edited)
      .map(product => product.original);

    const pCreate = this.restService.mergeProducts(mergedProducts);
    const pDelete = this.restService.deleteProducts(deletedProducts);

    Promise.all([pCreate, pDelete])
      .then(() => {
        this.message.success(`
          Products saved successfully.
          (<b>${mergedProducts.length}</b> created/updated,
          <b>${deletedProducts.length}</b> deleted)
        `);
        this.loadProducts();
      })
      .catch(reason => this.message.error(reason));
  }
}
