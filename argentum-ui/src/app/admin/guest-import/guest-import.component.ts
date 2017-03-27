import { Component, OnInit, ViewChild } from '@angular/core';
import { Guest } from '../../common/model/guest';
import { RestService } from '../../common/rest-service/rest.service';
import { MessageComponent } from '../../common/message/message.component';
import { DeleteGuestsModalComponent } from '../delete-guests-modal/delete-guests-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

declare let Papa: any;

@Component({
  selector: 'app-guest-import',
  templateUrl: 'guest-import.component.html',
  styleUrls: ['guest-import.component.scss']
})
export class GuestImportComponent implements OnInit {
  codeCol = '';
  nameCol = '';
  mailCol = '';
  statusCol = '';

  @ViewChild(MessageComponent)
  private message: MessageComponent;

  constructor(private restService: RestService, private modalService: NgbModal) {
  }

  ngOnInit() {
  }

  import(target: any) {
    let file = target.files[0];
    if (!file) {
      return;
    }
    let reader = new FileReader();
    reader.onload = (event: ProgressEvent) => this.parse((<FileReader>event.target).result);
    reader.readAsText(file);

    // Reset value so onChange is triggered again on future uploads.
    target.value = '';
  }

  parse(content: string) {
    Papa.parse(content, {
      header: true,
      complete: results => {
        let requiredFields = [this.codeCol, this.nameCol, this.mailCol, this.statusCol];
        for (let field of requiredFields) {
          if (results.meta.fields.indexOf(field) == -1) {
            this.message.error(`Column "${field}" not found in imported file.`);
            return;
          }
        }

        let guests: Guest[] = [];

        results.data.forEach(row => {
          guests.push({
            id: -1,
            code: row[this.codeCol],
            name: row[this.nameCol],
            mail: row[this.mailCol],
            status: row[this.statusCol],
            checkedIn: null,
            card: null,
            balance: 0,
            bonus: 0
          });
        });

        this.restService.mergeGuests(guests)
          .then(() => this.message.success(`Successfully imported ${guests.length} guests.`))
          .catch(reason => this.message.error(`Error: ${reason}`));
      }
    });
  }

  deleteGuests() {
    let modal = this.modalService.open(DeleteGuestsModalComponent, { backdrop: 'static' });
    modal.result.then(() => {
      this.restService.deleteGuests()
        .then(() => this.message.success(`Deleted all guests and orders.`))
        .catch(reason => this.message.error(`Error: ${reason}`));
    }, () => void(0))
  }
}
