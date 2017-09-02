import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Guest } from '../../common/model/guest';
import { MessageComponent } from '../../common/message/message.component';

@Component({
  selector: 'app-refund-modal',
  templateUrl: './refund-modal.component.html',
  styleUrls: ['./refund-modal.component.scss']
})
export class RefundModalComponent implements OnInit {
  guest: Guest;

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  confirm() {
    this.activeModal.close();
  }

}
