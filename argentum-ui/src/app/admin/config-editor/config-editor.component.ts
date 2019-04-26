import { Component, OnInit, ViewChild } from '@angular/core';
import { Config } from '../../common/model/config';
import { MessageComponent } from '../../common/message/message.component';
import { KeypadModalComponent } from '../../common/keypad-modal/keypad-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {formatCurrency} from '../../common/util/format';

class EditorConfig {
  original: Config;
  edited: Config;

  constructor(original: Config) {
    this.original = Object.assign({}, original);
    this.edited = Object.assign({}, original);
  }

  hasChangedValue(): boolean {
    return this.original.value !== this.edited.value;
  }
}

@Component({
  selector: 'app-config',
  templateUrl: './config-editor.component.html',
  styleUrls: ['./config-editor.component.scss']
})
export class ConfigEditorComponent implements OnInit {
  config: EditorConfig = null;

  @ViewChild(MessageComponent)
  private message: MessageComponent;

  constructor(private modalService: NgbModal) {
  }

  ngOnInit() {
    this.loadConfig();
  }

  loadConfig(): void {
    // TODO
    Promise.resolve({})
      .then((config: Config) => this.config = new EditorConfig(config))
      .catch(reason => this.message.error(reason));
  }

  resetAll() {
    this.loadConfig();
  }

  setPostpaidLimit() {
    const modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;
    modal.result.then((result: number) => {
      this.config.edited.value = formatCurrency(result);
    }, result => void(0));
  }

  save() {
    // TODO
    Promise.resolve()
      .then(() => {
        this.message.success('Config saved successfully.');
        this.loadConfig();
      })
      .catch(reason => this.message.error(reason));
  }

}
