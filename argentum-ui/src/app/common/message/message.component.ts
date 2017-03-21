import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  message: string;
  messageType: string;
  messageStream = new Subject<{ message: string, type: string }>();

  constructor() {
  }

  ngOnInit() {
    this.messageStream.subscribe(message => {
      this.message = message.message;
      this.messageType = message.type;
    });
  }

  error(message: string) {
    this.messageStream.next({ message: message, type: 'danger' });
  }

  success(message: string) {
    this.messageStream.next({ message: message, type: 'success' });
  }

}
