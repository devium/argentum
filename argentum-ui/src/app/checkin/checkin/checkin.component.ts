import {Component, OnInit, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NewGuestModalComponent} from '../new-guest-modal/new-guest-modal.component';
import {SearchGuestModalComponent} from '../search-guest-modal/search-guest-modal.component';
import {Guest} from '../../common/model/guest';
import {KeypadModalComponent} from '../../common/keypad-modal/keypad-modal.component';
import {MessageComponent} from '../../common/message/message.component';
import {GroupBasedComponent} from '../../common/group-based/group-based.component';
import {GuestService} from '../../common/rest-service/guest.service';
import {CardModalComponent} from '../../common/card-modal/card-modal.component';
import {TransactionService} from '../../common/rest-service/transaction.service';
import {Transaction} from '../../common/model/transaction';
import {formatCurrency} from '../../common/utils';
import {flatMap} from 'rxjs/operators';

@Component({
  selector: 'app-checkin',
  templateUrl: 'checkin.component.html',
  styleUrls: ['checkin.component.scss']
})
export class CheckinComponent extends GroupBasedComponent implements OnInit {
  @ViewChild(MessageComponent, { static: true })
  message: MessageComponent;

  constructor(
    private transactionService: TransactionService,
    private guestService: GuestService,
    private modalService: NgbModal
  ) {
    super();
  }

  newGuest() {
    const modal = this.modalService.open(NewGuestModalComponent, {backdrop: 'static'});
    (<SearchGuestModalComponent>modal.componentInstance).message = this.message;
    modal.result.then(
      (guest: Guest) => {
        this.guestService.create(guest, [guest.status]).subscribe(
          (createdGuest: Guest) => this.message.success(`Created guest <b>${guest.name}</b>.`),
          (error: string) => this.message.error(error)
        );
      },
      (cancel: string) => void (0)
    );
  }

  searchGuest() {
    const modal = this.modalService.open(SearchGuestModalComponent, {backdrop: 'static'});
    (<SearchGuestModalComponent>modal.componentInstance).message = this.message;
  }

  deposit() {
    this.transfer(+1);
  }

  withdraw() {
    this.transfer(-1);
  }

  private transfer(sign: number) {
    this.modalService.open(CardModalComponent, {backdrop: 'static', size: 'sm'}).result.then(
      (card: string) => {
        const keypadModal = this.modalService.open(KeypadModalComponent, {backdrop: 'static', size: 'sm'}).result.then(
          (value: number) => {
            value *= sign;
            this.transactionService.createByCard(card, value, false, []).pipe(
              flatMap((transaction: Transaction) => this.transactionService.commit(transaction, []))
            ).subscribe((transaction: Transaction) => {
                if (sign < 0) {
                  this.message.success(`
                    Withdrew balance of <b>€${formatCurrency((value))}</b>
                    from <b>card #${card}</b>.
                  `);
                } else {
                  this.message.success(`
                    Deposited balance of <b>€${formatCurrency((value))}</b>
                    on <b>card #${card}</b>.
                  `);
                }
              },
              (error: string) => this.message.error(error)
            );
          },
          (cancel: string) => void (0)
        );
      },
      (cancel: string) => void (0)
    );
  }

}
