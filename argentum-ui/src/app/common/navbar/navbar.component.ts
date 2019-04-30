import {Component, OnInit} from '@angular/core';
import {GroupBasedComponent} from '../group-based/group-based.component';

interface LinkSpec {
  groups: string[];
  target: string;
  name: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss']
})
export class NavbarComponent extends GroupBasedComponent implements OnInit {
  navbarCollapsed = true;

  links: LinkSpec[] = [];

  constructor() {
    super();
  }

  refreshLinks() {
    this.links = [
      // {groups: ['coat_check'], target: '/coat_check', name: 'Coat check'},
      {groups: ['order'], target: '/order', name: 'Order'},
      {groups: ['check_in', 'transfer'], target: '/checkin', name: 'Check-in'},
      {groups: ['scan'], target: '/scan', name: 'Scan'},
      {groups: ['admin'], target: '/admin', name: 'Admin'},
    ].filter((link: LinkSpec) => this.hasGroup(link.groups));
  }

  ngOnInit(): any {
    super.ngOnInit();
    this.refreshLinks();
  }
}
