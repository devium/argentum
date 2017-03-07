import { Component } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

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
    if (char == '.' && this.display.indexOf('.') > -1) {
      return;
    } else if (char == 0 && this.display == '0') {
      return;
    }
    this.display += char;
  }

  delete(): void {
    this.display = this.display.substr(0, this.display.length - 1);
  }
}
