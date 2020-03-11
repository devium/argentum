import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Guest} from '../../common/model/guest';
import {CardModalComponent} from '../../common/card-modal/card-modal.component';
import {GroupBasedComponent} from '../../common/group-based/group-based.component';
import {Status} from '../../common/model/status';
import {MessageComponent} from '../../common/message/message.component';
import {formatTime, isDarkBackground, getRandomInt} from '../../common/utils';
import {StatusService} from '../../common/rest-service/status.service';

@Component({
  selector: 'app-new-guest',
  templateUrl: 'new-guest-modal.component.html',
  styleUrls: ['new-guest-modal.component.scss']
})
export class NewGuestModalComponent extends GroupBasedComponent implements OnInit {
  isDarkBackground = isDarkBackground;

  noStatus = new Status(undefined, undefined, 'No Status', '#ffffff');

  code = '';
  name = '';
  mail = '';
  status: Status = this.noStatus;
  card: string;
  balance = 0;
  bonus = 0;
  statuses: Status[] = [this.noStatus];

  @ViewChild('nameInput', { static: true })
  nameInput: ElementRef;

  message: MessageComponent;


  constructor(
    private statusService: StatusService,
    private modalService: NgbModal,
    public activeModal: NgbActiveModal
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.nameInput.nativeElement.focus();

    this.code = `BOX-${formatTime(new Date())}-${getRandomInt(2 ** 32).toString(16)}`;

    this.statusService.list().subscribe(
      (statuses: Status[]) => {
        this.statuses = statuses;
        this.statuses.unshift(this.noStatus);
      },
      (error: string) => this.message.error(error)
    );
  }

  setCard() {
    this.modalService.open(CardModalComponent, {backdrop: 'static', size: 'sm'}).result.then(
      (card: string) => this.card = card,
      (cancel: string) => void (0)
    );
  }

  confirm(): void {
    const guest: Guest = new Guest(
      undefined,
      this.code,
      this.name,
      this.mail,
      this.status === this.noStatus ? null : this.status,
      new Date(),
      this.card,
      undefined,
      undefined
    );
    this.activeModal.close(guest);
  }

}
