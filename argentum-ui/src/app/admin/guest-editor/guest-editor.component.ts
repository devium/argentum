import { Component, OnInit } from "@angular/core";
import { RestService } from "../../common/rest-service/rest.service";
import { Guest } from "../../common/model/guest";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { KeypadComponent } from "../../common/keypad/keypad.component";

@Component({
  selector: 'app-guest-editor',
  templateUrl: './guest-editor.component.html',
  styleUrls: ['./guest-editor.component.scss']
})
export class GuestEditorComponent implements OnInit {
  private readonly PAGE_SIZE = 20;
  private page = 0;
  private guests: Guest[] = [];
  private guestsTotal = 0;

  constructor(private restService: RestService, private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  changePage(newPage: number) {
    this.restService.getGuestsPaginated(this.PAGE_SIZE, newPage - 1).then(result => {
      this.guests = result.guests;
      this.guestsTotal = result.guestsTotal;
    });
  }

  setBonus(guest: Guest) {
    let modal = this.modalService.open(KeypadComponent, { backdrop: 'static', size: 'sm' });
    (<KeypadComponent>modal.componentInstance).captureKeyboard = true;
    modal.result.then((result: number) => {
      guest.bonus = result;
      this.restService.updateGuestBonus(guest);
    }, result => void(0));
  }

}
