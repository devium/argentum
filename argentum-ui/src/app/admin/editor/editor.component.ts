import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Editor} from '../../common/model/editor';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {KeypadModalComponent} from '../../common/keypad-modal/keypad-modal.component';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {CardModalComponent} from '../../common/card-modal/card-modal.component';
import {AbstractModel} from '../../common/model/abstract-model';
import {MessageComponent} from '../../common/message/message.component';
import {formatCurrency, isDarkBackground} from '../../common/utils';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {
  @ViewChild(MessageComponent)
  message: MessageComponent;

  @Input()
  editorConfig: Editor.Config<any>;
  @Input()
  pageSize: number;

  // Expose Editor namespace to the HTML template.
  Editor = Editor;
  isDarkBackground = isDarkBackground;
  formatCurrency = formatCurrency;

  filterStream = new Subject<null>();
  page = 1;

  constructor(private modalService: NgbModal) {
  }

  ngOnInit() {
    this.filterStream.pipe(
      debounceTime(500)
    ).subscribe(() => {
      this.page = 1;
      this.editorConfig.reload();
    });
  }

  setFilter(fieldSpec: Editor.FieldSpec<any>, value: any) {
    this.editorConfig.filters[fieldSpec.key] = fieldSpec.filterMap(value);
    this.filterStream.next();
  }

  cycleSort(key: any) {
    const currentSort = this.editorConfig.filters['ordering'];
    const negKey = '-' + key;
    if (currentSort === undefined || (currentSort !== key && currentSort !== negKey)) {
      this.editorConfig.filters['ordering'] = key;
    } else if (currentSort === key) {
      this.editorConfig.filters['ordering'] = negKey;
    } else if (currentSort === negKey) {
      delete this.editorConfig.filters['ordering'];
    }
    this.editorConfig.reload();
  }

  promptCurrency(entry: Editor.Entry<any>, key: any) {
    const modal = this.modalService.open(KeypadModalComponent, {backdrop: 'static', size: 'sm'});
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;
    modal.result.then(
      (result: number) => entry.active[key] = result,
      (cancel: string) => void (0)
    );
  }

  promptCard(entry: Editor.Entry<any>, key: any) {
    this.modalService.open(CardModalComponent, {backdrop: 'static', size: 'sm'}).result
      .then(
        (card: string) => entry.active[key] = card,
        (cancel: string) => void (0)
      );
  }

  addBalance(entry: Editor.Entry<any>, key: any, sign: number) {
    const modal = this.modalService.open(KeypadModalComponent, {backdrop: 'static', size: 'sm'});
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;
    modal.result.then(
      (value: number) => entry.active[key] += sign * value,
      (cancel: string) => void (0)
    );
  }

  setBalance(entry: Editor.Entry<any>, key: any) {
    const modal = this.modalService.open(KeypadModalComponent, {backdrop: 'static', size: 'sm'});
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;
    modal.result.then(
      (value: number) => entry.active[key] = value,
      (cancel: string) => void (0)
    );
  }

  toggleCheckbox(entry: Editor.Entry<any>, key: any, value: number) {
    const array = <number[]>entry.active[key];
    const index = array.indexOf(value);
    if (index === -1) {
      array.push(value);
      entry.active[key] = array.sort((a: number, b: number) => a - b);
    } else {
      array.splice(index, 1);
    }
  }

  modelArrayContains(entry: Editor.Entry<any>, key: any, value: AbstractModel): boolean {
    const array = <AbstractModel[]>entry.active[key];
    return array.some((model: AbstractModel) => model.id === value.id);
  }

  toggleModelCheckbox(entry: Editor.Entry<any>, key: any, value: AbstractModel) {
    const array = <AbstractModel[]>entry.active[key];
    const index = array.findIndex((model: AbstractModel) => model.id === value.id);
    if (index === -1) {
      array.push(value);
      entry.active[key] = array.sort((a: AbstractModel, b: AbstractModel) => a.id - b.id);
    } else {
      array.splice(index, 1);
    }
  }

}
