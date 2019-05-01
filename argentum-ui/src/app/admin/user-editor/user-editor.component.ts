import {Component, OnInit, ViewChild} from '@angular/core';
import {Editor} from '../../common/model/editor';
import {User} from '../../common/model/user';
import {UserService} from '../../common/rest-service/user.service';
import {GroupService} from '../../common/rest-service/group.service';
import {Group} from '../../common/model/group';
import OptionSpec = Editor.OptionSpec;
import {ProductRangeService} from '../../common/rest-service/product-range.service';
import {combineLatest} from 'rxjs';
import {ProductRange} from '../../common/model/product-range';
import {MessageComponent} from '../../common/message/message.component';
import {EditorComponent} from '../editor/editor.component';


@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.scss']
})
export class UserEditorComponent implements OnInit {
  @ViewChild(EditorComponent)
  editor: EditorComponent;
  message: MessageComponent;

  editorConfig: Editor.Config<User>;

  constructor(private userService: UserService, private groupService: GroupService, private productRangeService: ProductRangeService) {
  }

  ngOnInit() {
    this.message = this.editor.message;

    const groupNames = {
      admin: 'Admin',
      coat_check: 'Coat check',
      order: 'Order',
      check_in: 'Check-in',
      transfer: 'Transfer',
      scan: 'Scan',
      product_range_all: 'All ranges'
    };

    const groups$ = this.groupService.list();
    const productRanges$ = this.productRangeService.list();

    combineLatest(groups$, productRanges$).subscribe(
      ([groups, productRanges]: [Group[], ProductRange[]]) => {
        this.editorConfig = new Editor.Config<User>(
          this.message,
          () => this.userService.list(groups),
          (original: User, active: User) => {
            if (active.id === undefined) {
              return this.userService.create(active);
            } else {
              return this.userService.update(active);
            }
          },
          (original: User) => this.userService.delete(original),
          new User(undefined, 'newuser', '', []),
          [
            new Editor.FieldSpec<User>('ID', Editor.FieldType.ReadOnlyField, 'id'),
            new Editor.FieldSpec<User>('Name', Editor.FieldType.StringField, 'username',
              {disabled: ((entry: Editor.Entry<User>) => entry.original.username === 'admin')}
            ),
            new Editor.FieldSpec<User>('Password', Editor.FieldType.PasswordField, 'password'),
            new Editor.FieldSpec<User>('Groups', Editor.FieldType.MultiModelCheckboxField, 'groups',
              {
                optionSpecs: groups.map((group: Group) => {
                  if (group.name.startsWith('product_range_') && group.name !== 'product_range_all') {
                    const productRangeId = parseInt(group.name.split('_')[2], 10);
                    return new OptionSpec(
                      `Range "${productRanges.find((productRange: ProductRange) => productRange.id === productRangeId).name}"`,
                      group
                    );
                  }
                  return new OptionSpec(groupNames[group.name], group);
                }),
                disabled: ((entry: Editor.Entry<User>) => entry.original.username === 'admin')
              }
            )
          ],
          (entry: Editor.Entry<User>) => entry.original.username === 'admin'
        );
      },
      (error: string) => this.message.error(error)
    );
  }
}
