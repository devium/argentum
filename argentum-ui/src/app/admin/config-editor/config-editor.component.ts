import {Component, OnInit, ViewChild} from '@angular/core';
import {Editor} from '../../common/model/editor';
import {Config} from '../../common/model/config';
import {ConfigService} from '../../common/rest-service/config.service';
import {MessageComponent} from '../../common/message/message.component';
import {EditorComponent} from '../editor/editor.component';

@Component({
  selector: 'app-config',
  templateUrl: './config-editor.component.html',
  styleUrls: ['./config-editor.component.scss']
})
export class ConfigEditorComponent implements OnInit {
  @ViewChild(EditorComponent)
  editor: EditorComponent;
  message: MessageComponent;

  editorConfig: Editor.Config<Config>;

  constructor(private configService: ConfigService) {
  }

  ngOnInit() {
    this.message = this.editor.message;

    this.editorConfig = new Editor.Config<Config>(
      this.message,
      () => this.configService.list(),
      (original: Config, active: Config) => this.configService.update(active),
      null,
      null,
      [
        new Editor.FieldSpec<Config>('ID', Editor.FieldType.ReadOnlyField, 'id'),
        new Editor.FieldSpec<Config>('Key', Editor.FieldType.ReadOnlyField, 'key'),
        new Editor.FieldSpec<Config>('Value', Editor.FieldType.StringField, 'value')
      ]
    );
  }
}
