import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewGuestModalComponent } from '../new-guest-modal/new-guest-modal.component';
import { SearchGuestModalComponent } from '../search-guest-modal/search-guest-modal.component';
import { Guest } from '../../common/model/guest';
import { RestService } from '../../common/rest-service/rest.service';
import { KeypadModalComponent } from '../../common/keypad-modal/keypad-modal.component';
import { MessageComponent } from '../../common/message/message.component';
import { CardBarComponent } from '../../common/card-bar/card-bar.component';
import { GroupBasedComponent } from '../../common/group-based/group-based.component';

@Component({
  selector: 'app-checkin',
  templateUrl: 'checkin.component.html',
  styleUrls: ['checkin.component.scss']
})
export class CheckinComponent extends GroupBasedComponent implements OnInit {
  @ViewChild(MessageComponent)
  message: MessageComponent;
  @ViewChild(CardBarComponent)
  cardBar: CardBarComponent;

  constructor(private restService: RestService, private modalService: NgbModal) {
    super();
  }

  newGuest() {
    this.enableCardBar(false);
    const modal = this.modalService.open(NewGuestModalComponent, { backdrop: 'static' });
    (<SearchGuestModalComponent>modal.componentInstance).message = this.message;
    modal.result.then((guest: Guest) => {
      this.restService.mergeGuests([guest])
        .then(() => {
          this.message.success(`Created guest <b>${guest.name}</b>.`);
        })
        .catch(reason => {
          this.message.error(reason);
        });
      this.enableCardBar(true);
    }, result => this.enableCardBar(true));
  }

  searchGuest() {
    this.enableCardBar(false);
    const modal = this.modalService.open(SearchGuestModalComponent, { backdrop: 'static' });
    (<SearchGuestModalComponent>modal.componentInstance).message = this.message;
    modal.result.then(() => this.enableCardBar(true), () => this.enableCardBar(true));
  }

  deposit() {
    this.transfer(false);
  }

  withdraw() {
    this.transfer(true);
  }

  private transfer(withdrawal: boolean) {
    const guest = this.cardBar.guest;
    const keypadModal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    this.enableCardBar(false);

    keypadModal.result.then((value: number) => {
      if (withdrawal) {
        value = -value;
      }

      this.restService.addBalance(guest, value)
        .then((newBalance: number) => {
          this.enableCardBar(true);

          if (withdrawal) {
            this.message.success(`
              Withdrew balance of <b>€${value.toFixed(2)}</b>
              from <b>${guest.name}</b>.
              New balance: <b>€${newBalance.toFixed(2)}</b>
            `);
          } else {
            this.message.success(`
              Deposited balance of <b>€${value.toFixed(2)}</b>
              for <b>${guest.name}</b>.
              New balance: <b>€${newBalance.toFixed(2)}</b>
            `);
          }

          guest.balance = newBalance;
        })
        .catch(reason => {
          this.enableCardBar(true);
          this.message.error(reason);
        });
    }, () => this.enableCardBar(true));
  }

  enableCardBar(enable: boolean): void {
    this.cardBar.active = enable;
  }

}
