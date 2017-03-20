import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewGuestComponent } from '../new-guest/new-guest.component';
import { SearchGuestComponent } from '../search-guest/search-guest.component';
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
    let modal = this.modalService.open(NewGuestComponent, { backdrop: 'static' });
    modal.result.then((guest: Guest) => this.restService.saveGuests([guest]), result => void(0));
  }

  searchGuest() {
    let modal = this.modalService.open(SearchGuestComponent, { backdrop: 'static' });
  }

}
