import { Component, OnInit } from '@angular/core';
import { GroupBasedComponent } from '../group-based/group-based.component';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss']
})
export class NavbarComponent extends GroupBasedComponent implements OnInit {
  navbarCollapsed = true;

  links: string[][] = [];

  constructor() {
    super();
  }

  refreshLinks() {
    this.links = [
      // [['coat_check'], '/coat_check', 'Coat check'],
      [['order'], '/order', 'Order'],
      [['check_in', 'TRANSFER'], '/checkin', 'Check-in'],
      [['scan'], '/scan', 'Scan'],
      [['admin'], '/admin', 'Admin'],
    ]
      .filter((link: any) => this.hasGroup(link[0]))
      .map((link: string[]) => [link[1], link[2]]);
  }

  ngOnInit(): any {
    super.ngOnInit();
    this.refreshLinks();
  }
}
