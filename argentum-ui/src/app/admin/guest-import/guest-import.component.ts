import { Component, OnInit } from '@angular/core';

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

  constructor() {
  }

  ngOnInit() {
  }

  import(file: File) {
    let reader = new FileReader();
    reader.onload = (event: ProgressEvent) => this.parse((<FileReader>event.target).result);
    reader.readAsText(file);
  }

  parse(content: string) {

  }

}
