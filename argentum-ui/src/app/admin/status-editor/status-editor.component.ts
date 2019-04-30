import {Component, OnInit, ViewChild} from '@angular/core';
import {Editor} from '../../common/model/editor';
import {Status} from '../../common/model/status';
import {StatusService} from '../../common/rest-service/status.service';
import {MessageComponent} from '../../common/message/message.component';
import {EditorComponent} from '../editor/editor.component';

@Component({
  selector: 'app-status-editor',
  templateUrl: './status-editor.component.html',
  styleUrls: ['./status-editor.component.scss']
})
export class StatusEditorComponent implements OnInit {
  @ViewChild(EditorComponent)
  editor: EditorComponent;
  message: MessageComponent;

  editorConfig: Editor.Config<Status>;

  constructor(private statusService: StatusService) {
  }

  ngOnInit() {
    this.message = this.editor.message;

    this.editorConfig = new Editor.Config<Status>(
      this.message,
      () => this.statusService.list(),
      (original: Status, active: Status) => {
        if (active.id === undefined) {
          return this.statusService.create(active);
        } else {
          return this.statusService.update(active);
        }
      },
      (original: Status) => this.statusService.delete(original),
      new Status(undefined, 'new_status', 'New Status', '#00ffff'),
      [
        new Editor.FieldSpec<Status>('ID', Editor.FieldType.ReadOnlyField, 'id'),
        new Editor.FieldSpec<Status>('Internal name', Editor.FieldType.StringField, 'internalName'),
        new Editor.FieldSpec<Status>('Display name', Editor.FieldType.StringField, 'displayName'),
        new Editor.FieldSpec<Status>('Color', Editor.FieldType.ColorField, 'color')
      ]
    );
  }
}
