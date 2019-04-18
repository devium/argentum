import {Component, OnInit, ViewChild} from '@angular/core';
import {RestService} from '../../common/rest-service/rest.service';
import {Guest} from '../../common/model/guest';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {KeypadModalComponent} from '../../common/keypad-modal/keypad-modal.component';
import {Subject} from 'rxjs';
import {MessageComponent} from '../../common/message/message.component';
import {distinctUntilChanged} from 'rxjs/internal/operators/distinctUntilChanged';
import {debounceTime} from 'rxjs/operators';


@Component({
  selector: 'app-guest-editor',
  templateUrl: './guest-editor.component.html',
  styleUrls: ['./guest-editor.component.scss']
})
export class GuestEditorComponent implements OnInit {
  readonly PAGE_SIZE = 15;
  page = 1;
  guests: Guest[] = [];
  guestsTotal = 0;
  codeLike = '';
  nameLike = '';
  mailLike = '';
  statusLike = '';
  codeStream = new Subject<string>();
  nameStream = new Subject<string>();
  mailStream = new Subject<string>();
  statusStream = new Subject<string>();
  sort = '';
  direction = 'asc';

  @ViewChild(MessageComponent)
  message: MessageComponent;

  constructor(private restService: RestService, private modalService: NgbModal) {
  }

  ngOnInit() {
    this.codeStream.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(code => {
      this.codeLike = code;
      this.changePage(1);
      this.page = 1;
    });
    this.nameStream.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(name => {
        this.nameLike = name;
        this.changePage(1);
        this.page = 1;
      }
    );
    this.mailStream.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(mail => {
      this.mailLike = mail;
      this.changePage(1);
      this.page = 1;
    });
    this.statusStream.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(status => {
      this.statusLike = status;
      this.changePage(1);
      this.page = 1;
    });
    this.changePage(1);
  }

  refresh() {
    this.restService.getGuestsPaginatedAndFiltered(
      this.PAGE_SIZE,
      this.page - 1,
      this.codeLike,
      this.nameLike,
      this.mailLike,
      this.statusLike,
      this.sort,
      this.direction
    )
      .then((result: { guests: Guest[], guestsTotal: number }) => {
        this.guests = result.guests;
        this.guestsTotal = result.guestsTotal;
      });
  }

  changePage(newPage: number) {
    this.page = newPage;
    this.refresh();
  }

  addBalance(guest: Guest) {
    const modal = this.modalService.open(KeypadModalComponent, {backdrop: 'static', size: 'sm'});
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;

    modal.result.then(result => {
      this.restService.addBalance(guest, result)
        .then((newBalance: number) => {
          guest.balance = newBalance;
          this.message.success(
            `Added €${result.toFixed(2)} to balance of "${guest.name}". New balance: €${newBalance.toFixed(2)}`
          );
        })
        .catch(reason => this.message.error(reason));
    }, result => void (0));
  }

  subBalance(guest: Guest) {
    const modal = this.modalService.open(KeypadModalComponent, {backdrop: 'static', size: 'sm'});
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;

    modal.result.then(result => {
      this.restService.addBalance(guest, -result)
        .then((newBalance: number) => {
          guest.balance = newBalance;
          this.message.success(
            `Removed €${result.toFixed(2)} from balance of "${guest.name}". New balance: €${newBalance.toFixed(2)}`
          );
        })
        .catch(reason => this.message.error(reason));
    }, result => void (0));
  }

  addBonus(guest: Guest) {
    const modal = this.modalService.open(KeypadModalComponent, {backdrop: 'static', size: 'sm'});
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;

    modal.result.then(result => {
      this.restService.addBonus(guest, result)
        .then((newBonus: number) => {
          guest.bonus = newBonus;
          this.message.success(
            `Added €${result.toFixed(2)} to bonus of "${guest.name}". New bonus: €${newBonus.toFixed(2)}`
          );
        })
        .catch(reason => this.message.error(reason));
    }, result => void (0));
  }

  subBonus(guest: Guest) {
    const modal = this.modalService.open(KeypadModalComponent, {backdrop: 'static', size: 'sm'});
    (<KeypadModalComponent>modal.componentInstance).captureKeyboard = true;

    modal.result.then(result => {
      this.restService.addBonus(guest, -result)
        .then((newBonus: number) => {
          guest.bonus = newBonus;
          this.message.success(
            `Removed €${result.toFixed(2)} from bonus of "${guest.name}". New bonus: €${newBonus.toFixed(2)}`
          );
        })
        .catch(reason => this.message.error(reason));
    }, result => void (0));
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

  cycleSort(field: string) {
    if (this.sort === field) {
      if (this.direction === 'asc') {
        this.direction = 'desc';
      } else if (this.direction === 'desc') {
        this.direction = 'asc';
        this.sort = 'id';
      } else {
        this.direction = 'asc';
      }
    } else {
      this.sort = field;
    }
    this.refresh();
  }

}
