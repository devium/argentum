import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-group-based',
  templateUrl: './group-based.component.html',
  styleUrls: ['./group-based.component.scss']
})
export class GroupBasedComponent implements OnInit {
  groupNames: string[] = [];

  constructor() { }

  ngOnInit() {
    this.getGroups();
  }

  getGroups() {
    const groupName = localStorage.getItem('groups');
    this.groupNames = groupName ? groupName.split(',') : [];
  }

  hasGroup(groupNames: string[]): boolean {
    return groupNames
      .map(groupName => this.groupNames.includes(groupName))
      .reduce((a, b) => a || b, false);
  }

}
