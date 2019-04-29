import {Component, OnInit} from '@angular/core';
import {Editor} from '../../common/model/editor';
import {ProductService} from '../../common/rest-service/product.service';
import {ProductRangeService} from '../../common/rest-service/product-range.service';
import {CategoryService} from '../../common/rest-service/category.service';
import {Product} from '../../common/model/product';
import {combineLatest} from 'rxjs';
import {ProductRange} from '../../common/model/product-range';
import {Category} from '../../common/model/category';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-product-editor',
  templateUrl: 'product-editor.component.html',
  styleUrls: ['product-editor.component.scss']
})
export class ProductEditorComponent implements OnInit {
  editorConfig: Editor.Config<Product>;

  constructor(
    private productService: ProductService,
    private productRangeService: ProductRangeService,
    private categoryService: CategoryService
  ) {
  }

  ngOnInit() {
    const productRanges$ = this.productRangeService.list();
    const categories$ = this.categoryService.list();

    combineLatest(productRanges$, categories$).subscribe(([productRanges, categories]: [ProductRange[], Category[]]) => {
      const categoryOptions = categories.map((category: Category) => new Editor.OptionSpec(category.name, category, category.color));
      categoryOptions.push(new Editor.OptionSpec('No Category', null, '#ffffff'));

      this.editorConfig = new Editor.Config<Product>(
        // Hide deprecated products.
        () => this.productService.list(categories).pipe(
          map((products: Product[]) => products.filter((product: Product) => !product.deprecated))
        ),
        (original: Product, active: Product) => {
          if (original.id === undefined) {
            return this.productService.create(active);
          } else if (active.price !== original.price && original.id) {
            // Price is immutable. We need to create a new product.
            const deprecate$ = this.productService.deprecate(original);
            const create$ = this.productService.create(active);

            return combineLatest(deprecate$, create$).pipe(
              map(([deprecated, created]: [Product, Product]) => created)
            );
          } else {
            return this.productService.update(active);
          }
        },
        (original: Product) => this.productService.deprecate(original).pipe(
          map((deprecated: Product) => null)
        ),
        new Product(undefined, 'New Product', false, 0.00, null, []),
        [
          new Editor.FieldSpec<Product>('ID', Editor.FieldType.ReadOnlyField, 'id'),
          new Editor.FieldSpec<Product>('Name', Editor.FieldType.StringField, 'name'),
          new Editor.FieldSpec<Product>('Price', Editor.FieldType.CurrencyField, 'price'),
          new Editor.FieldSpec<Product>('Category', Editor.FieldType.DropdownField, 'category', categoryOptions),
          new Editor.FieldSpec<Product>(
            'Product ranges',
            Editor.FieldType.MultiCheckboxField,
            'productRangeIds',
            productRanges.map((productRange: ProductRange) => new Editor.OptionSpec(productRange.name, productRange.id))
          )
        ]
      );
    });
  }
}
