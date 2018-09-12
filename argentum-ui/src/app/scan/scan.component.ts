import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageComponent } from '../common/message/message.component';

@Component({
  selector: 'app-balance',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss']
})
export class ScanComponent implements OnInit {

  @ViewChild('message')
  message: MessageComponent;

  constructor() {
  }

  ngOnInit() {
  }

}
