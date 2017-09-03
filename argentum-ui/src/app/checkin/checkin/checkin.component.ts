import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewGuestModalComponent } from '../new-guest-modal/new-guest-modal.component';
import { SearchGuestModalComponent } from '../search-guest-modal/search-guest-modal.component';
import { Guest } from '../../common/model/guest';
import { RestService } from '../../common/rest-service/rest.service';
import { KeypadModalComponent } from '../../common/keypad-modal/keypad-modal.component';
import { MessageComponent } from '../../common/message/message.component';
import { CardBarComponent } from '../../common/card-bar/card-bar.component';
import { RoleBasedComponent } from '../../common/role-based/role-based.component';

@Component({
  selector: 'app-checkin',
  templateUrl: 'checkin.component.html',
  styleUrls: ['checkin.component.scss']
})
export class CheckinComponent extends RoleBasedComponent implements OnInit {
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
    modal.result.then((guest: Guest) => {
      this.restService.mergeGuests([guest])
        .then(() => {
          this.message.success(`Created guest "${guest.name}".`);
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

  recharge() {
    const guest = this.cardBar.guest;
    const keypadModal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    this.cardBar.active = false;

    keypadModal.result.then((value: number) => {
      this.restService.addBalance(guest, value)
        .then((newBalance: number) => {
          this.cardBar.active = true;
          this.message.success(
            `Recharged balance of "${guest.name}" with €${value.toFixed(2)}. New balance: €${newBalance.toFixed(2)}`
          );
          guest.balance = newBalance;
        })
        .catch(reason => {
          this.cardBar.active = true;
          this.message.error(reason);
        });

    }, () => void(0));
  }

  settle() {
    const guest = this.cardBar.guest;

    if (guest.balance === 0) {
      this.message.success('Nothing to settle.');
      return;
    }

    const keypadModal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    this.cardBar.active = false;
    keypadModal.result.then((value: number) => {
      // If balance > 0, reinterpret as refund.
      // If balance < 0, reinterpret as settlement.
      let balanceAdded = value;
      if (guest.balance > 0) {
        balanceAdded = -balanceAdded;
      }

      this.restService.addBalance(guest, balanceAdded).then((newBalance: number) => {
        this.cardBar.active = true;
        this.message.success(
          `Settled balance of "${guest.name}" by €${value.toFixed(2)}. New balance: €${newBalance.toFixed(2)}`
        );
        guest.balance = newBalance;
      })
      .catch(reason => {
        this.cardBar.active = true;
        this.message.error(reason);
      });
    }, () => void(0));
  }

  enableCardBar(enable: boolean): void {
    this.cardBar.active = enable;
  }

}
