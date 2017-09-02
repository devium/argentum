import { Component, OnInit, ViewChild } from '@angular/core';
import { Config } from '../../common/model/config';
import { RestService } from '../../common/rest-service/rest.service';
import { MessageComponent } from '../../common/message/message.component';
import { ConfigResponse } from '../../common/rest-service/response/config-response';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  config: Config;

  @ViewChild(MessageComponent)
  private message: MessageComponent;

  constructor(private restService: RestService) {
  }

  ngOnInit() {
    this.loadConfig();
  }

  loadConfig(): void {
    this.restService.getConfig()
      .then((config: Config) => this.config = config)
      .catch(reason => this.message.error(reason));
  }

  resetAll() {
    this.loadConfig();
  }

  save() {
    this.restService.setConfig(this.config)
      .then((response: ConfigResponse) => this.message.success('Config saved successfully.'))
      .catch(reason => this.message.error(reason));
  }

}
