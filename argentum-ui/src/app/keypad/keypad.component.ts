import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-keypad',
  templateUrl: './keypad.component.html',
  styleUrls: ['./keypad.component.scss']
})
export class KeypadComponent {
  private display = '';

  constructor(public activeModal: NgbActiveModal) {
  }

  entry(char: any): void {
    let decimalPos = this.display.indexOf('.');
    if (this.display.length > 8) {
      return;
    } else if (char == '.' && decimalPos > -1) {
      return;
    } else if (char == 0 && this.display == '0') {
      return;
    } else if (decimalPos > -1 && this.display.length - decimalPos == 3) {
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
    this.activeModal.close(value);
  }
}
