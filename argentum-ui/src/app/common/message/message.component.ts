
import {debounceTime} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  readonly DEFAULT_MESSAGE_TIME = 15000;
  message: string;
  messageType: string;
  messageStream = new Subject<{ message: string, type: string }>();
  autoClose = true;
  timer = new Subject<string>();

  constructor() {
  }

  ngOnInit() {
    this.messageStream.subscribe(message => {
      this.message = message.message;
      this.messageType = message.type;
      if (this.autoClose) {
        this.timer.next(null);
      }
    });

    this.timer.pipe(debounceTime(this.DEFAULT_MESSAGE_TIME)).subscribe(() => this.message = null);
  }

  error(message: string) {
    console.error(message);
    this.messageStream.next({ message: message, type: 'danger' });
  }

  success(message: string) {
    console.log(message);
    this.messageStream.next({ message: message, type: 'success' });
  }

}
