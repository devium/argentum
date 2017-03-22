import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewGuestModalComponent } from '../new-guest-modal/new-guest-modal.component';
import { SearchGuestModalComponent } from '../search-guest-modal/search-guest-modal.component';
import { Guest } from '../../common/model/guest';
import { RestService } from '../../common/rest-service/rest.service';
import { KeypadModalComponent } from '../../common/keypad-modal/keypad-modal.component';
import { CardModalComponent } from '../card-modal/card-modal.component';
import { MessageComponent } from '../../common/message/message.component';

@Component({
  selector: 'app-checkin',
  templateUrl: 'checkin.component.html',
  styleUrls: ['checkin.component.scss']
})
export class CheckinComponent implements OnInit {
  @ViewChild(MessageComponent)
  private message: MessageComponent;

  constructor(private restService: RestService, private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  newGuest() {
    let modal = this.modalService.open(NewGuestModalComponent, { backdrop: 'static' });
    modal.result.then((guest: Guest) => {
      this.restService.createGuests([guest])
        .then(guests => this.message.success(`Created guest "${guest.name}".`))
        .catch(reason => this.message.error(`Error: ${reason}`));
    }, result => void(0));
  }

  searchGuest() {
    let modal = this.modalService.open(SearchGuestModalComponent, { backdrop: 'static' });
    (<SearchGuestModalComponent>modal.componentInstance).message = this.message;
  }

  recharge() {
    let keypadModal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    (<KeypadModalComponent>keypadModal.componentInstance).captureKeyboard = true;
    let value: number;
    keypadModal.result.then(result => {

      value = result;
      let cardModal = this.modalService.open(CardModalComponent, { backdrop: 'static' });

      cardModal.result.then(card => {
        this.restService.getGuestByCard(card)
          .then((guest: Guest) => {
            this.restService.addBalance(guest, value)
              .then(() => this.message.success(`Recharged balance of "${guest.name}" with €${value.toFixed(2)}`))
              .catch(reason => this.message.error(`Error: ${reason}`));
          })
          .catch(reason => this.message.error(`Error: ${reason}`));
      }, () => void(0));

    }, () => void(0));
  }

}
