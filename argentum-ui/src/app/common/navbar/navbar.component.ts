import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  roles: string[] = [];

  constructor() {
  }

  ngOnInit() {
    let roles = localStorage.getItem('roles');
    this.roles = roles ? roles.split(',') : [];
  }

  hasRole(roles: string[]) {
    return roles
      .map(role => this.roles.indexOf(role) > -1)
      .reduce((a, b) => a || b, false);
  }

}
