import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-role-based',
  templateUrl: './role-based.component.html',
  styleUrls: ['./role-based.component.scss']
})
export class RoleBasedComponent implements OnInit {
  roles: string[] = [];

  constructor() { }

  ngOnInit() {
    this.getRoles();
  }

  getRoles() {
    const roles = localStorage.getItem('roles');
    this.roles = roles ? roles.split(',') : [];
  }

  hasRole(roles: string[]) {
    return roles
      .map(role => this.roles.includes(role))
      .reduce((a, b) => a || b, false);
  }

}
