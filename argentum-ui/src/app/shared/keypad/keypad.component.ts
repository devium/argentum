import { Component, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from "rxjs";

@Component({
  selector: 'app-keypad',
  templateUrl: 'keypad.component.html',
  styleUrls: ['keypad.component.scss']
})
export class KeypadComponent implements OnInit {
  display = '';
  captureKeyboard = false;

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    Observable.fromEvent(document, 'keydown').subscribe((event: KeyboardEvent) => {
      if (this.captureKeyboard) {
        if (event.keyCode == 8 /* Backspace */) {
          this.deleteChar();
        } else {
          this.entry(event.key)
        }
      }
    });
  }

  entry(char: string): void {
    let decimalPos = this.display.indexOf('.');
    let ignore = ('.0123456789'.indexOf(char) <= -1)
      || (this.display.length >= 8)
      || (char == '.' && decimalPos > -1)
      || (char == '0' && this.display == '0')
      || (decimalPos > -1 && this.display.length - decimalPos == 3);

    if (ignore) {
      return;
    }

    this.display += char;
    if (this.display == '.') {
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
