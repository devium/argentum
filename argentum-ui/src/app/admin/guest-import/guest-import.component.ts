import {Guest} from '../../common/model/guest';
import {MessageComponent} from '../../common/message/message.component';
import {DeleteGuestsModalComponent} from '../delete-guests-modal/delete-guests-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Component, OnInit, ViewChild} from '@angular/core';
import {Papa, PapaParseResult} from 'ngx-papaparse';
import {GuestService} from '../../common/rest-service/guest.service';

interface FieldSpec {
  key: string;
  name: string;
  value: string;
}

@Component({
  selector: 'app-guest-import',
  templateUrl: 'guest-import.component.html',
  styleUrls: ['guest-import.component.scss']
})
export class GuestImportComponent implements OnInit {
  Object = Object;

  fields: FieldSpec[] = [
    {
      key: 'code',
      name: 'Code column',
      value: ''
    },
    {
      key: 'name',
      name: 'Name column',
      value: ''
    },
    {
      key: 'mail',
      name: 'Mail column',
      value: ''
    },
    {
      key: 'status',
      name: 'Status column',
      value: ''
    }
  ];

  @ViewChild(MessageComponent)
  private message: MessageComponent;

  constructor(
    private guestService: GuestService,
    private modalService: NgbModal,
    private papa: Papa
  ) {
  }

  ngOnInit() {
  }

  importCsv(target: any) {
    const file = target.files[0];
    if (!file) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent) => this.parse(<string>(<FileReader>event.target).result);
    reader.readAsText(file);

    // Reset value so onChange is triggered again on future uploads.
    target.value = '';
  }

  parse(content: string) {
    this.papa.parse(content, {
      header: true,
      complete: (results: PapaParseResult) => {
        if (results.errors) {
          console.error(results.errors);
        }
        const requiredFields = this.fields.map((field: FieldSpec) => field.value);
        const fieldColumns = {};
        this.fields.forEach((field: FieldSpec) => fieldColumns[field.key] = field.value);
        for (const field of requiredFields) {
          if (!results.meta.fields.includes(field)) {
            this.message.error(`Column <b>${field}</b> not found in imported file.`);
            return;
          }
        }

        const guests: Guest[] = [];
        results.data.forEach(row => {
          // Skip erroneous rows.
          for (const field of this.fields) {
            if (!row.hasOwnProperty(field.value)) {
              return;
            }
          }

          guests.push(new Guest(
            undefined,
            row[fieldColumns['code']],
            row[fieldColumns['name']],
            row[fieldColumns['mail']],
            row[fieldColumns['status']],
            undefined,
            undefined,
            undefined,
            undefined
          ));
        });

        this.guestService.listUpdate(guests).subscribe(
          (guestsSaved: Guest[]) => this.message.success(`Successfully imported or updated <b>${guestsSaved.length}</b> guests.`),
          error => this.message.error(error)
        );
      }
    });
  }

  deleteGuests() {
    this.modalService.open(DeleteGuestsModalComponent, {backdrop: 'static'}).result.then(
      () => {
        this.guestService.deleteAll().subscribe(
          () => this.message.success(`<b>Deleted all guests and orders.</b>`),
          error => this.message.error(error)
        );
      },
      (cancel: string) => void (0)
    );
  }
}
