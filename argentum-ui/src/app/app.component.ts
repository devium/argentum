import { Component } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { KeypadComponent } from "./keypad/keypad.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  title = 'Argentum';

  constructor(private modalService: NgbModal) {
  }

  openKeypad(): void {
    this.modalService.open(KeypadComponent, { backdrop: 'static', size: 'sm' });
  }
}
