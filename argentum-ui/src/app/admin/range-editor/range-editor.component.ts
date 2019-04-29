import { Component, OnInit } from '@angular/core';
import {Editor} from '../../common/model/editor';
import {ProductRange} from '../../common/model/product-range';
import {ProductRangeService} from '../../common/rest-service/product-range.service';

@Component({
  selector: 'app-range-editor',
  templateUrl: 'range-editor.component.html',
  styleUrls: ['range-editor.component.scss']
})
export class RangeEditorComponent implements OnInit {
  editorConfig: Editor.Config<ProductRange>;

  constructor(private productRangeService: ProductRangeService) {
  }

  ngOnInit() {
    this.editorConfig = new Editor.Config<ProductRange>(
      () => this.productRangeService.list(),
      (original: ProductRange, active: ProductRange) => {
        if (active.id === undefined) {
          return this.productRangeService.create(active);
        } else {
          return this.productRangeService.update(active);
        }
      },
      (original: ProductRange) => this.productRangeService.delete(original),
      new ProductRange(undefined, 'New Product Range', undefined),
      [
        new Editor.FieldSpec<ProductRange>('ID', Editor.FieldType.ReadOnlyField, 'id'),
        new Editor.FieldSpec<ProductRange>('Name', Editor.FieldType.StringField, 'name')
      ]
    );
  }
}
