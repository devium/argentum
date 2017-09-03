import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Guest } from '../../common/model/guest';

@Component({
  selector: 'app-settle-modal',
  templateUrl: './settle-modal.component.html',
  styleUrls: ['./settle-modal.component.scss']
})
export class SettleModalComponent implements OnInit {
  guest: Guest;

  constructor(private modalService: NgbModal, public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  confirm() {
    this.activeModal.close();
  }

}
