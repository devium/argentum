import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductRange } from '../../common/model/product-range';
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
    this.original.productRangeIds = [...original.productRangeIds];
    this.edited = Object.assign({}, original);
    this.edited.productRangeIds = [...original.productRangeIds];
    this.displayed = this.edited;
  }

  hasChangedName(): boolean {
    return !this.original || this.original.name !== this.edited.name;
  }

  hasChangedPrice(): boolean {
    return !this.original || this.original.price !== this.edited.price;
  }

  hasChangedCategory(): boolean {
    return !this.original || this.original.category.id !== this.edited.category.id;
  }

  hasChangedRanges(): boolean {
    if (!this.original) {
      return true;
    }

    let equal = true;
    this.original.productRangeIds.forEach((rangeId: number) => equal = equal && this.edited.productRangeIds.includes(rangeId));
    this.edited.productRangeIds.forEach((rangeId: number) => equal = equal && this.original.productRangeIds.includes(rangeId));
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
  categories  = new Map<number, Category>();

  @ViewChild(MessageComponent)
  message: MessageComponent;

  constructor(private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    // TODO
    // this.restService.getProductData()
    Promise.resolve({})
      .then((productData: { products: Product[], categories: Category[], ranges: ProductRange[] }) => {
        this.categories = new Map(productData.categories.map(
          (category: Category) => [category.id, category] as [number, Category])
        );
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
    product.edited.category.id = categoryId;
    product.updateChanged();
  }

  toggleRange(product: EditorProduct, range: ProductRange) {
    const rangeIndex = product.edited.productRangeIds.indexOf(range.id);
    if (rangeIndex !== -1) {
      product.edited.productRangeIds.splice(rangeIndex, 1);
    } else {
      product.edited.productRangeIds.push(range.id);
    }
    product.updateChanged();
  }

  isDarkBackground(color: string): boolean {
    return isDarkBackground(color);
  }

  reset(product: EditorProduct) {
    product.edited = Object.assign({}, product.original);
    product.edited.productRangeIds = [...product.original.productRangeIds];
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
    const newProduct = new EditorProduct(new Product(-1, 'New Product', false, 0.00, null, []));
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

    // TODO
    const pCreate = Promise.resolve();
    const pDelete = Promise.resolve();

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
