import {Component, OnInit, ViewChild} from '@angular/core';
import {Editor} from '../../common/model/editor';
import {CategoryService} from '../../common/rest-service/category.service';
import {Category} from '../../common/model/category';
import {MessageComponent} from '../../common/message/message.component';
import {EditorComponent} from '../editor/editor.component';

@Component({
  selector: 'app-category-editor',
  templateUrl: 'category-editor.component.html',
  styleUrls: ['category-editor.component.scss']
})
export class CategoryEditorComponent implements OnInit {
  @ViewChild(EditorComponent, { static: true })
  editor: EditorComponent;
  message: MessageComponent;

  editorConfig: Editor.Config<Category>;

  constructor(private categoryService: CategoryService) {
  }

  ngOnInit() {
    this.message = this.editor.message;

    this.editorConfig = new Editor.Config<Category>(
      this.message,
      () => this.categoryService.list(),
      (original: Category, active: Category) => {
        if (active.id === undefined) {
          return this.categoryService.create(active);
        } else {
          return this.categoryService.update(active);
        }
      },
      (original: Category) => this.categoryService.delete(original),
      new Category(undefined, 'New Category', '#ffffff'),
      [
        new Editor.FieldSpec<Category>('ID', Editor.FieldType.ReadOnlyField, 'id'),
        new Editor.FieldSpec<Category>('Name', Editor.FieldType.StringField, 'name'),
        new Editor.FieldSpec<Category>('Color', Editor.FieldType.ColorField, 'color')
      ]
    );
  }
}
