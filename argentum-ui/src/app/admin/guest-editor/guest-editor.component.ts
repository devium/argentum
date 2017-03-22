import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../../common/rest-service/rest.service';
import { Guest } from '../../common/model/guest';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KeypadModalComponent } from '../../common/keypad-modal/keypad-modal.component';
import { Subject } from 'rxjs';
import { MessageComponent } from '../../common/message/message.component';

@Component({
  selector: 'app-guest-editor',
  templateUrl: './guest-editor.component.html',
  styleUrls: ['./guest-editor.component.scss']
})
export class GuestEditorComponent implements OnInit {
  private readonly PAGE_SIZE = 15;
  private page = 1;
  private guests: Guest[] = [];
  private guestsTotal = 0;
  private codeLike = '';
  private nameLike = '';
  private mailLike = '';
  private statusLike = '';
  private codeStream = new Subject<string>();
  private nameStream = new Subject<string>();
  private mailStream = new Subject<string>();
  private statusStream = new Subject<string>();

  @ViewChild(MessageComponent)
  private message: MessageComponent;

  constructor(private restService: RestService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.codeStream
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(code => {
        this.codeLike = code;
        this.changePage(1);
        this.page = 1;
      });
    this.nameStream
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(name => {
        this.nameLike = name;
        this.changePage(1);
        this.page = 1;
      });
    this.mailStream
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(mail => {
        this.mailLike = mail;
        this.changePage(1);
        this.page = 1;
      });
    this.statusStream
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(status => {
        this.statusLike = status;
        this.changePage(1);
        this.page = 1;
      });
    this.changePage(1);
  }

  changePage(newPage: number) {
    this.restService.getGuestsPaginatedAndFiltered(this.PAGE_SIZE, newPage - 1, this.codeLike, this.nameLike, this.mailLike, this.statusLike).then(result => {
      this.guests = result.guests;
      this.guestsTotal = result.guestsTotal;
    });
  }

  addBalance(guest: Guest) {
    let modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;

    modal.result.then(result => {
      this.restService.addBalance(guest, result)
        .then(newBalance => {
          guest.balance = newBalance;
          this.message.success(`Added €${result.toFixed(2)} to balance of "${guest.name}". New balance: €${newBalance.toFixed(2)}`);
        })
        .catch(reason => this.message.error(`Error: ${reason}`));
    }, result => void(0));
  }

  subBalance(guest: Guest) {
    let modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;

    modal.result.then(result => {
      this.restService.addBalance(guest, -result)
        .then(newBalance => {
          guest.balance = newBalance;
          this.message.success(`Removed €${result.toFixed(2)} from balance of "${guest.name}". New balance: €${newBalance.toFixed(2)}`);
        })
        .catch(reason => this.message.error(`Error: ${reason}`));
    }, result => void(0));
  }

  addBonus(guest: Guest) {
    let modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;

    modal.result.then(result => {
      this.restService.addBonus(guest, result)
        .then(newBonus => {
          guest.bonus = newBonus;
          this.message.success(`Added €${result.toFixed(2)} to bonus of "${guest.name}". New bonus: €${newBonus.toFixed(2)}`);
        })
        .catch(reason => this.message.error(`Error: ${reason}`));
    }, result => void(0));
  }

  subBonus(guest: Guest) {
    let modal = this.modalService.open(KeypadModalComponent, { backdrop: 'static', size: 'sm' });
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;

    modal.result.then(result => {
      this.restService.addBonus(guest, -result)
        .then(newBonus => {
          guest.bonus = newBonus;
          this.message.success(`Removed €${result.toFixed(2)} from bonus of "${guest.name}". New bonus: €${newBonus.toFixed(2)}`);
        })
        .catch(reason => this.message.error(`Error: ${reason}`));
    }, result => void(0));
  }

  filterCode(code: string) {
    this.codeStream.next(code);
  }

  filterName(name: string) {
    this.nameStream.next(name);
  }

  filterMail(mail: string) {
    this.mailStream.next(mail);
  }

  filterStatus(status: string) {
    this.statusStream.next(status);
  }

}
