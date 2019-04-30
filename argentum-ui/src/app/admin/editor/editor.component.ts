import {Component, Input, OnInit} from '@angular/core';
import {Editor} from '../../common/model/editor';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {KeypadModalComponent} from '../../common/keypad-modal/keypad-modal.component';
import {isDarkBackground} from '../../common/util/is-dark-background';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {CardModalComponent} from '../../common/card-modal/card-modal.component';
import {formatCurrency} from '../../common/util/format';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

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

  setFilter(key: any, value: any) {
    this.editorConfig.filters[key] = value;
    this.filterStream.next();
  }

  promptCurrency(entry: Editor.Entry<any>, key: any) {
    const modal = this.modalService.open(KeypadModalComponent, {backdrop: 'static', size: 'sm'});
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;
    modal.result.then(
      (result: number) => {
        entry.active[key] = result;
      },
      result => void (0)
    );
  }

  promptCard(entry: Editor.Entry<any>, key: any) {
    this.modalService.open(CardModalComponent, {backdrop: 'static', size: 'sm'}).result
      .then(
        (result: number) => {
          entry.active[key] = result;
        },
        result => void (0)
      );
  }

  addBalance(entry: Editor.Entry<any>, key: any, sign: number) {
    const modal = this.modalService.open(KeypadModalComponent, {backdrop: 'static', size: 'sm'});
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;
    modal.result.then(
      (result: number) => {
        entry.active[key] += sign * result;
      },
      result => void (0)
    );
  }

  setBalance(entry: Editor.Entry<any>, key: any) {
    const modal = this.modalService.open(KeypadModalComponent, {backdrop: 'static', size: 'sm'});
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;
    modal.result.then(
      (result: number) => {
        entry.active[key] = result;
      },
      result => void (0)
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

}
