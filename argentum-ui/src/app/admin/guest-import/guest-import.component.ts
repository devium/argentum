import { Component, OnInit } from '@angular/core';
import { Guest } from '../../common/model/guest';
import { RestService } from '../../common/rest-service/rest.service';

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

  constructor(private restService: RestService) {
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
            this.error(`Column "${field}" not found in imported file.`);
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

        this.restService.saveGuests(guests);
      }
    });
  }

  error(message: string) {
    // TODO
    console.log(message);
  }
}
