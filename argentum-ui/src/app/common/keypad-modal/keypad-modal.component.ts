import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-keypad',
  templateUrl: 'keypad-modal.component.html',
  styleUrls: ['keypad-modal.component.scss']
})
export class KeypadModalComponent implements OnInit, OnDestroy {
  display = '';
  captureKeyboard = false;
  keyStreamSub: Subscription;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.keyStreamSub = Observable.fromEvent(document, 'keydown').subscribe((event: KeyboardEvent) => {
      if (this.captureKeyboard) {
        if (event.keyCode === 8 /* Backspace */) {
          this.deleteChar();
        } else if (event.keyCode === 13 /* Enter */) {
          this.confirm();
          // Prevent click-through to possibly focused buttons.
          event.preventDefault();
        } else {
          this.entry(event.key);
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.keyStreamSub.unsubscribe();
  }

  entry(char: string): void {
    const decimalPos = this.display.indexOf('.');
    const ignore = (!'.0123456789'.includes(char))
      || (this.display.length >= 8)
      || (char === '.' && decimalPos > -1)
      || (char === '0' && this.display === '0')
      || (decimalPos > -1 && this.display.length - decimalPos === 3);

    if (ignore) {
      return;
    }

    this.display += char;
    if (this.display === '.') {
      this.display = '0.';
    }
  }

  deleteChar(): void {
    this.display = this.display.substr(0, this.display.length - 1);
  }

  confirm(): void {
    let value = parseFloat(this.display);
    if (isNaN(value)) {
      value = 0;
    }
    this.activeModal.close(value);
  }
}
