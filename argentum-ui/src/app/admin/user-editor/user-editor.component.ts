import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../common/model/user';
import { MessageComponent } from '../../common/message/message.component';
import { ProductRange } from '../../common/model/product-range';
import { RestService } from '../../common/rest-service/rest.service';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import {Group} from '../../common/model/group';

class EditorUser {
  original: User;
  edited: User;
  displayed: User;
  changed = false;

  constructor(original: User) {
    this.original = Object.assign({}, original);
    this.original.groups = original.groups.slice();
    this.edited = Object.assign({}, original);
    this.edited.groups = original.groups.slice();
    this.displayed = this.edited;
    this.edited.password = '';
  }

  hasChangedUsername(): boolean {
    return !this.original || this.original.username !== this.edited.username;
  }

  hasChangedPassword(): boolean {
    return !this.original || this.edited.password !== '';
  }

  hasChangedGroups(): boolean {
    if (!this.original) {
      return true;
    }

    const allInOrig = this.original.groups
      .map(group => this.edited.groups.includes(group))
      .reduce((a, b) => a && b, true);
    const allInEdit = this.edited.groups
      .map(group => this.original.groups.includes(group))
      .reduce((a, b) => a && b, true);
    return !(allInOrig && allInEdit);
  }

  updateChanged(): void {
    this.changed = this.hasChangedUsername()
      || this.hasChangedPassword()
      || this.hasChangedGroups();
  }
}


@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss']
})
export class UserEditorComponent implements OnInit {
  users: EditorUser[] = [];
  ranges: ProductRange[] = [];
  GROUPS: { [id: string]: string } = {
    'ADMIN': 'Admin',
    'COAT_CHECK': 'Coat check',
    'ORDER': 'Order',
    'CHECKIN': 'Check-in',
    'TRANSFER': 'Transfer',
    'SCAN': 'Scan',
    'ALL_RANGES': 'All ranges'
  };

  @ViewChild(MessageComponent)
  private message: MessageComponent;

  @ViewChild(NavbarComponent)
  navbar: NavbarComponent;

  constructor(private restService: RestService) {
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.restService.getUsers()
      .then((users: User[]) => this.users = users.map(user => new EditorUser(user)))
      .catch(reason => this.message.error(reason));
    this.restService.getProductRanges()
      .then((ranges: ProductRange[]) => this.ranges = ranges)
      .catch(reason => this.message.error(reason));
  }

  changeUsername(user: EditorUser, value: string) {
    user.updateChanged();
  }

  changePassword(user: EditorUser, value: string) {
    user.updateChanged();
  }

  toggleGroup(user: EditorUser, group: Group) {
    const index = user.edited.groups.indexOf(group);
    if (index > -1) {
      user.edited.groups.splice(index, 1);
    } else {
      user.edited.groups.push(group);
    }

    user.updateChanged();
  }

  reset(user: EditorUser) {
    user.edited = Object.assign({}, user.original);
    user.edited.password = '';
    user.edited.groups = user.original.groups.slice();
    user.displayed = user.edited;
    user.updateChanged();
  }

  remove(user: EditorUser) {
    if (user.original) {
      user.edited = null;
      user.displayed = user.original;
    } else {
      this.users.splice(this.users.indexOf(user), 1);
    }
  }

  newUser() {
    const newUser = new EditorUser(new User(-1, 'user', '', []));

    newUser.original = null;
    newUser.updateChanged();
    this.users.push(newUser);
  }

  resetAll() {
    this.users.forEach(product => {
      if (product.original) {
        this.reset(product);
      }
    });
    this.users = this.users.filter(product => product.original);
  }

  save() {
    const mergedUsers = this.users
      .filter(user => user.edited && user.changed)
      .map(user => user.edited);
    const deletedUsers = this.users
      .filter(user => !user.edited)
      .map(user => user.original);

    const pCreate = this.restService.mergeUsers(mergedUsers);
    const pDelete = this.restService.deleteUsers(deletedUsers);

    Promise.all([pCreate, pDelete])
      .then(() => {
        this.message.success(`
          Users saved successfully.
          (<b>${mergedUsers.length}</b> created/updated,
          <b>${deletedUsers.length}</b> deleted)
        `);
        this.loadUsers();
        this.restService.getUser()
          .then((user: User) => {
            localStorage.setItem('groups', user.groups.join(','));
            this.navbar.getGroups();
            this.navbar.refreshLinks();
          });
      })
      .catch(reason => this.message.error(reason));
  }
}
