import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-nav',
  templateUrl: 'admin-nav.component.html',
  styleUrls: ['admin-nav.component.scss']
})
export class AdminNavComponent implements OnInit {
  navbarCollapsed = true;

  readonly links = [
    ['/admin/dashboard', 'Dashboard'],
    ['/admin/products', 'Products'],
    ['/admin/categories', 'Categories'],
    ['/admin/ranges', 'Product ranges'],
    ['/admin/guests', 'Guest list'],
    ['/admin/import', 'Guest import'],
    ['/admin/statuses', 'Statuses'],
    ['/admin/discounts', 'Discounts'],
    ['/admin/users', 'Users'],
    ['/admin/config', 'Config']
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
