import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Guest } from '../../common/model/guest';
import { Observable, Subject } from 'rxjs';
import { RestService } from '../../common/rest-service/rest.service';

@Component({
  selector: 'app-search-guest',
  templateUrl: 'search-guest.component.html',
  styleUrls: ['search-guest.component.scss']
})
export class SearchGuestComponent implements OnInit {
  private codeStream = new Subject<string>();
  results: Guest[] = [];
  guest: Guest;

  @ViewChild('codeInput')
  codeInput: ElementRef;

  constructor(private restService: RestService, private modalService: NgbModal, public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
    this.codeStream
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(code => code ? this.restService.getGuestsByCode(code) : Observable.of([]))
      .subscribe(guests => this.results = guests);
  }

  search(code: string): void {
    this.codeStream.next(code);
  }

  lockGuest(guest: Guest) {
    this.guest = guest;
    this.codeInput.nativeElement.value = `${guest.code} ${guest.name}`;
    this.codeInput.nativeElement.disabled = true;
  }

  checkIn() {
    this.guest.checkedIn = new Date();
  }

  setCard() {
    // TODO
  }

  confirm(): void {
    this.activeModal.close();
  }

}
