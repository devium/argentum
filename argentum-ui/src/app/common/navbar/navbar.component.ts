import { Component, OnInit } from '@angular/core';
import { RoleBasedComponent } from '../role-based/role-based.component';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss']
})
export class NavbarComponent extends RoleBasedComponent implements OnInit {
  navbarCollapsed = true;

  links: string[][] = [];

  constructor() {
    super();
  }

  refreshLinks() {
    this.links = [
      // [['COAT_CHECK'], '/coat_check', 'Coat check'],
      [['ORDER'], '/order', 'Order'],
      [['CHECKIN', 'TRANSFER'], '/checkin', 'Check-in'],
      [['SCAN'], '/scan', 'Scan'],
      [['ADMIN'], '/admin', 'Admin'],
    ]
      .filter((link: any) => this.hasRole(link[0]))
      .map((link: string[]) => [link[1], link[2]]);
  }

  ngOnInit(): any {
    super.ngOnInit();
    this.refreshLinks();
  }
}
