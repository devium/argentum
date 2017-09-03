import { Component, OnInit, ViewChild } from '@angular/core';
import { Config } from '../../common/model/config';
import { RestService } from '../../common/rest-service/rest.service';
import { MessageComponent } from '../../common/message/message.component';
import { ConfigResponse } from '../../common/rest-service/response/config-response';
import { KeypadModalComponent } from '../../common/keypad-modal/keypad-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

class EditorConfig {
  original: Config;
  edited: Config;

  constructor(original: Config) {
    this.original = Object.assign({}, original);
    this.edited = Object.assign({}, original);
  }

  hasChangedPostpaidLimit(): boolean {
    return this.original.postpaidLimit !== this.edited.postpaidLimit;
  }
}

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  config: EditorConfig = null;

  @ViewChild(MessageComponent)
  private message: MessageComponent;

  constructor(private restService: RestService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.loadConfig();
  }

  loadConfig(): void {
    this.restService.getConfig()
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
      this.config.edited.postpaidLimit = result;
    }, result => void(0));
  }

  save() {
    this.restService.setConfig(this.config.edited)
      .then((response: ConfigResponse) => {
        this.message.success('Config saved successfully.');
        this.loadConfig();
      })
      .catch(reason => this.message.error(reason));
  }

}
