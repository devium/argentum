import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../../common/rest-service/rest.service';
import { Statistics } from '../../common/model/statistics';
import { MessageComponent } from '../../common/message/message.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: Statistics;

  @ViewChild(MessageComponent)
  message: MessageComponent;

  constructor(private restService: RestService) {
  }

  ngOnInit() {
    this.refresh();
  }

  refresh(): void {
    this.restService.getStatistics()
      .then((stats: Statistics) => this.stats = stats)
      .catch(reason => this.message.error(reason));
  }

}
