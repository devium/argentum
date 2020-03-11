import {Guest} from '../../common/model/guest';
import {MessageComponent} from '../../common/message/message.component';
import {DeleteGuestsModalComponent} from '../delete-guests-modal/delete-guests-modal.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Component, OnInit, ViewChild} from '@angular/core';
import {Papa, PapaParseResult} from 'ngx-papaparse';
import {GuestService} from '../../common/rest-service/guest.service';
import {Status} from '../../common/model/status';
import {StatusService} from '../../common/rest-service/status.service';

interface FieldSpec {
  key: string;
  name: string;
  value: string;
}

interface DelimiterOption {
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

  delimiterOptions: DelimiterOption[] = [
    {
      name: 'Auto-detect',
      value: ''
    },
    {
      name: ',',
      value: ','
    },
    {
      name: ';',
      value: ';'
    }
  ];

  @ViewChild(MessageComponent, { static: true })
  private message: MessageComponent;

  delimiterOption: DelimiterOption = this.delimiterOptions[0];

  constructor(
    private statusService: StatusService,
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
      delimiter: this.delimiterOption.value,
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

        this.statusService.list().subscribe((statuses: Status[]) => {
            const statusMap = {};
            statuses.forEach((status: Status) => statusMap[status.internalName] = status);

            const guests: Guest[] = [];
            results.data.forEach(row => {
              // Skip erroneous rows.
              for (const field of this.fields) {
                if (!row.hasOwnProperty(field.value)) {
                  return;
                }
              }

              const code = row[fieldColumns['code']];
              if (code) {
                guests.push(new Guest(
                  undefined,
                  code.substring(0, 32),
                  row[fieldColumns['name']].substring(0, 64),
                  row[fieldColumns['mail']].substring(0, 64),
                  statusMap[row[fieldColumns['status']]],
                  undefined,
                  undefined,
                  undefined,
                  undefined
                ));
              }
            });

            this.guestService.listUpdate(guests).subscribe(
              (guestsSaved: Guest[]) => this.message.success(`Successfully imported or updated <b>${guestsSaved.length}</b> guests.`),
              error => this.message.error(error)
            );
          },
          (error: string) => this.message.error(error));
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
