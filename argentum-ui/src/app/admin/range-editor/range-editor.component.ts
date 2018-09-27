import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../../common/rest-service/rest.service';
import { ProductRange } from '../../common/model/product-range';
import { MessageComponent } from '../../common/message/message.component';

class EditorRange {
  original: ProductRange;
  edited: ProductRange;
  displayed: ProductRange;
  changed = false;

  constructor(original: ProductRange) {
    this.original = Object.assign({}, original);
    this.edited = Object.assign({}, original);
    this.displayed = this.edited;
  }

  hasChangedName(): boolean {
    return this.original.name !== this.edited.name;
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
      .catch(reason => this.message.error(reason));
  }

  changeName(range: EditorRange, value: string) {
    range.updateChanged();
  }

  reset(range: EditorRange) {
    range.edited = Object.assign({}, range.original);
    range.displayed = range.edited;
    range.updateChanged();
  }

  remove(range: EditorRange) {
    if (range.original) {
      range.edited = null;
      range.displayed = range.original;
    } else {
      this.productRanges.splice(this.productRanges.indexOf(range), 1);
    }
  }

  newRange() {
    const newRange = new EditorRange({
      id: -1,
      name: 'New Product Range'
    });
    newRange.original = null;
    newRange.updateChanged();
    this.productRanges.push(newRange);
  }

  resetAll() {
    this.productRanges.forEach(product => {
      if (product.original) {
        this.reset(product);
      }
    });
    this.productRanges = this.productRanges.filter(range => range.original);
  }

  save() {
    const mergedRanges = this.productRanges
      .filter(range => range.changed)
      .map(range => range.edited);
    const deletedRanges = this.productRanges
      .filter(range => !range.edited)
      .map(range => range.original);

    const pCreate = this.restService.mergeProductRanges(mergedRanges);
    const pDelete = this.restService.deleteProductRanges(deletedRanges);

    Promise.all([pCreate, pDelete])
      .then(() => {
        this.message.success(`
          Product ranges saved successfully.
          (<b>${mergedRanges.length}</b> created/updated,
          <b>${deletedRanges.length}</b> deleted)
        `);
        this.loadRanges();
      })
      .catch(reason => this.message.error(reason));
  }
}
