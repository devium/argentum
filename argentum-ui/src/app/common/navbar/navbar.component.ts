import { Component, OnInit } from '@angular/core';
import { RoleBasedComponent } from '../role-based/role-based.component';

@Component({
  selector: 'app-navbar',
  templateUrl: 'navbar.component.html',
  styleUrls: ['navbar.component.scss']
})
export class NavbarComponent extends RoleBasedComponent implements OnInit {
  navbarCollapsed = true;

  constructor() {
    super();
  }

  ngOnInit(): any {
    super.ngOnInit();
  }
}
