import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewGuestModalComponent } from '../new-guest-modal/new-guest-modal.component';
import { SearchGuestModalComponent } from '../search-guest-modal/search-guest-modal.component';
import { Guest } from '../../common/model/guest';
import { RestService } from '../../common/rest-service/rest.service';

@Component({
  selector: 'app-checkin',
  templateUrl: 'checkin.component.html',
  styleUrls: ['checkin.component.scss']
})
export class CheckinComponent implements OnInit {

  constructor(private restService: RestService, private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  newGuest() {
    let modal = this.modalService.open(NewGuestModalComponent, { backdrop: 'static' });
    modal.result.then((guest: Guest) => this.restService.saveGuests([guest]), result => void(0));
  }

  searchGuest() {
    let modal = this.modalService.open(SearchGuestModalComponent, { backdrop: 'static' });
  }

}
