import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../common/model/user';
import { MessageComponent } from '../../common/message/message.component';
import { ProductRange } from '../../common/model/product-range';
import { RestService } from '../../common/rest-service/rest.service';
import { NavbarComponent } from '../../common/navbar/navbar.component';

class EditorUser {
  original: User;
  edited: User;
  displayed: User;
  changed = false;

  constructor(original: User) {
    this.original = Object.assign({}, original);
    this.original.roles = original.roles.slice();
    this.edited = Object.assign({}, original);
    this.edited.roles = original.roles.slice();
    this.displayed = this.edited;
    this.edited.password = '';
  }

  hasChangedUsername(): boolean {
    return !this.original || this.original.username !== this.edited.username;
  }

  hasChangedPassword(): boolean {
    return !this.original || this.edited.password !== '';
  }

  hasChangedRoles(): boolean {
    if (!this.original) {
      return true;
    }

    const allInOrig = this.original.roles
      .map(role => this.edited.roles.includes(role))
      .reduce((a, b) => a && b, true);
    const allInEdit = this.edited.roles
      .map(role => this.original.roles.includes(role))
      .reduce((a, b) => a && b, true);
    return !(allInOrig && allInEdit);
  }

  updateChanged(): void {
    this.changed = this.hasChangedUsername()
      || this.hasChangedPassword()
      || this.hasChangedRoles();
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
  ROLES: { [id: string]: string } = {
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

  toggleRole(user: EditorUser, role: string) {
    const index = user.edited.roles.indexOf(role);
    if (index > -1) {
      user.edited.roles.splice(index, 1);
    } else {
      user.edited.roles.push(role);
    }

    user.updateChanged();
  }

  reset(user: EditorUser) {
    user.edited = Object.assign({}, user.original);
    user.edited.password = '';
    user.edited.roles = user.original.roles.slice();
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
    const newUser = new EditorUser({
      id: -1,
      username: 'user',
      password: '',
      roles: []
    });

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
            localStorage.setItem('roles', user.roles.join(','));
            this.navbar.getRoles();
            this.navbar.refreshLinks();
          });
      })
      .catch(reason => this.message.error(reason));
  }
}
