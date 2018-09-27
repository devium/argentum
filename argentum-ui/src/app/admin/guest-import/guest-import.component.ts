import { Guest } from '../../common/model/guest';
import { RestService } from '../../common/rest-service/rest.service';
import { MessageComponent } from '../../common/message/message.component';
import { DeleteGuestsModalComponent } from '../delete-guests-modal/delete-guests-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit, ViewChild } from '@angular/core';
import { PapaParseService } from 'ngx-papaparse';

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

  constructor(
    private restService: RestService,
    private modalService: NgbModal,
    private papa: PapaParseService
  ) {
  }

  ngOnInit() {
  }

  import_csv(target: any) {
    const file = target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent) => this.parse((<FileReader>event.target).result);
    reader.readAsText(file);

    // Reset value so onChange is triggered again on future uploads.
    target.value = '';
  }

  parse(content: string) {
    this.papa.parse(content, {
      header: true,
      complete: results => {
        const requiredFields = [this.codeCol, this.nameCol, this.mailCol, this.statusCol];
        for (const field of requiredFields) {
          if (!results.meta.fields.includes(field)) {
            this.message.error(`Column <b>${field}</b> not found in imported file.`);
            return;
          }
        }

        const guests: Guest[] = [];

        results.data.forEach(row => {
          if (!row[this.codeCol] || !row[this.nameCol] || !row[this.statusCol]) {
            return;
          }
          guests.push(new Guest(
            -1,
            row[this.codeCol],
            row[this.nameCol],
            row[this.mailCol],
            row[this.statusCol]
          ));
        });

        this.restService.mergeGuests(guests)
          .then(() => this.message.success(`Successfully imported <b>${guests.length}</b> guests.`))
          .catch(reason => this.message.error(reason));
      }
    });
  }

  deleteGuests() {
    const modal = this.modalService.open(DeleteGuestsModalComponent, { backdrop: 'static' });
    modal.result.then(() => {
      this.restService.deleteGuests()
        .then(() => this.message.success(`<b>Deleted all guests and orders.</b>`))
        .catch(reason => this.message.error(reason));
    }, () => void(0));
  }
}
