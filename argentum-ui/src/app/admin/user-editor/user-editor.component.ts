import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from '../../common/model/user';
import { MessageComponent } from '../../common/message/message.component';
import { ProductRange } from '../../common/model/product-range';
import { RestService } from '../../common/rest-service/rest.service';

class EditorUser {
  original: User;
  edited: User;
  displayed: User;
  changed: boolean = false;

  constructor(original: User) {
    this.original = Object.assign({}, original);
    this.original.roles = original.roles.slice();
    this.edited = Object.assign({}, original);
    this.edited.roles = original.roles.slice();
    this.displayed = this.edited;
    this.edited.password = '';
  }

  hasChangedUsername(): boolean {
    return !this.original || this.original.username != this.edited.username;
  }

  hasChangedPassword(): boolean {
    return !this.original || this.edited.password != '';
  }

  hasChangedRoles(): boolean {
    if (!this.original) {
      return true;
    }

    let allInOrig = this.original.roles.map(role => this.edited.roles.indexOf(role) > -1).reduce((a, b) => a && b, true);
    let allInEdit = this.edited.roles.map(role => this.original.roles.indexOf(role) > -1).reduce((a, b) => a && b, true);
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
    'ORDER': 'Order',
    'CHECKIN': 'Check-in',
    'RECHARGE': 'Recharge',
    'REFUND': 'Refund',
    'SCAN': 'Scan',
    'ALL_RANGES': 'All ranges'
  };

  @ViewChild(MessageComponent)
  private message: MessageComponent;

  constructor(private restService: RestService) {
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.restService.getUsers()
      .then((users: User[]) => this.users = users.map(user => new EditorUser(user)))
      .catch(reason => this.message.error(`Error: ${reason}`));
    this.restService.getProductRanges()
      .then((ranges: ProductRange[]) => this.ranges = ranges)
      .catch(reason => this.message.error(`Error: ${reason}`));
  }

  changeUsername(user: EditorUser, value: string) {
    user.updateChanged();
  }

  changePassword(user: EditorUser, value: string) {
    user.updateChanged();
  }

  toggleRole(user: EditorUser, role: string) {
    let index = user.edited.roles.indexOf(role);
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
    let newUser = new EditorUser({
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
    let mergedUsers = this.users
      .filter(user => user.edited && user.changed)
      .map(user => user.edited);
    let deletedUsers = this.users
      .filter(user => !user.edited)
      .map(user => user.original);

    let pCreate = this.restService.mergeUsers(mergedUsers);
    let pDelete = this.restService.deleteUsers(deletedUsers);

    Promise.all([pCreate, pDelete])
      .then(() => {
        this.message.success(`Users saved successfully. (${mergedUsers.length} created/updated, ${deletedUsers.length} deleted)`);
        this.loadUsers();
      })
      .catch(reason => this.message.error(`Error: ${reason}`))
  }
}
