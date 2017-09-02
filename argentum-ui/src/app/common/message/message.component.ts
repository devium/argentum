import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
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

    this.timer.debounceTime(5000).subscribe(() => this.message = null);
  }

  error(message: string) {
    this.messageStream.next({ message: message, type: 'danger' });
  }

  success(message: string) {
    this.messageStream.next({ message: message, type: 'success' });
  }

}
