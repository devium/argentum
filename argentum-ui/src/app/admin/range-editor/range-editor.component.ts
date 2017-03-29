import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../../common/rest-service/rest.service';
import { ProductRange } from '../../common/model/product-range';
import { MessageComponent } from '../../common/message/message.component';
import { toProductRangeMeta } from '../../common/rest-service/response/product-range-response-meta';

class EditorRange {
  original: ProductRange;
  edited: ProductRange;
  displayed: ProductRange;
  changed: boolean = false;

  constructor(original: ProductRange) {
    this.original = Object.assign({}, original);
    this.edited = Object.assign({}, original);
    this.displayed = this.edited;
  };

  hasChangedName(): boolean {
    return this.original.name != this.edited.name;
  }

  updateChanged() {
    this.changed = !this.original || this.hasChangedName();
  }
}

@Component({
  selector: 'app-range-editor',
  templateUrl: 'range-editor.component.html',
  styleUrls: ['range-editor.component.scss']
})
export class RangeEditorComponent implements OnInit {
  productRanges: EditorRange[] = [];

  @ViewChild(MessageComponent)
  private message: MessageComponent;

  constructor(private restService: RestService) {
  }

  ngOnInit() {
    this.loadRanges();
  }

  loadRanges() {
    this.restService.getProductRanges()
      .then((ranges: ProductRange[]) => this.productRanges = ranges.map(range => new EditorRange(range)))
      .catch(reason => this.message.error(`Error: ${reason}`));
  }

  changeName(range: EditorRange, value: string) {
    range.updateChanged();
  }

  private reset(range: EditorRange) {
    range.edited = Object.assign({}, range.original);
    range.displayed = range.edited;
    range.updateChanged();
  }

  private remove(range: EditorRange) {
    if (range.original) {
      range.edited = null;
      range.displayed = range.original;
    } else {
      this.productRanges.splice(this.productRanges.indexOf(range), 1);
    }
  }

  private newRange() {
    let newRange = new EditorRange({
      id: -1,
      name: 'New Product Range',
      products: []
    });
    newRange.original = null;
    newRange.updateChanged();
    this.productRanges.unshift(newRange);
  }

  private resetAll() {
    this.productRanges.forEach(product => {
      if (product.original) {
        this.reset(product);
      }
    });
    this.productRanges = this.productRanges.filter(range => range.original);
  }

  private save() {
    let mergedRanges = this.productRanges
      .filter(range => range.changed)
      .map(range => range.edited);
    let deletedRanges = this.productRanges
      .filter(range => !range.edited)
      .map(range => range.original);

    let pCreate = this.restService.mergeProductRanges(mergedRanges);
    let pDelete = this.restService.deleteProductRanges(deletedRanges);

    Promise.all([pCreate, pDelete])
      .then(() => {
        this.message.success(`Product ranges saved successfully. (${mergedRanges.length} created/updated, ${deletedRanges.length} deleted)`);
        this.loadRanges();
      })
      .catch(reason => this.message.error(`Error: ${reason}`));
  }
}
