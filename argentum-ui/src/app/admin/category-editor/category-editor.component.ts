import { Component, OnInit } from '@angular/core';
import { RestService } from '../../common/rest-service/rest.service';
import { Category } from '../../common/model/category';
import { Subject } from 'rxjs';

class EditorCategory {
  original: Category;
  edited: Category;
  displayed: Category;
  changed: boolean = false;

  constructor(original: Category) {
    this.original = Object.assign({}, original);
    this.edited = Object.assign({}, original);
    this.displayed = this.edited;
  }

  hasChangedName(): boolean {
    return this.original.name != this.edited.name;
  }

  hasChangedColor(): boolean {
    return this.original.color != this.edited.color;
  }

  updateChanged() {
    this.changed = !this.original || this.hasChangedName() || this.hasChangedColor();
  }
}

@Component({
  selector: 'app-category-editor',
  templateUrl: 'category-editor.component.html',
  styleUrls: ['category-editor.component.scss']
})
export class CategoryEditorComponent implements OnInit {
  categories: EditorCategory[] = [];
  message: string;
  messageType: string;
  messageStream = new Subject<{ message: string, type: string }>();

  constructor(private restService: RestService) {
  }

  ngOnInit() {
    this.messageStream.subscribe(message => {
      this.message = message.message;
      this.messageType = message.type;
    });
    this.loadCategories();
  }

  loadCategories() {
    this.restService.getCategories().then(categories => this.categories = categories.map(category => new EditorCategory(category)));
  }

  changeName(category: EditorCategory, value: string) {
    category.displayed.name = value;
    category.updateChanged();
  }

  changeColor(category: EditorCategory, value: string) {
    category.displayed.color = value;
    category.updateChanged();
  }

  private reset(category: EditorCategory) {
    category.edited = Object.assign({}, category.original);
    category.displayed = category.edited;
    category.updateChanged();
  }

  private remove(category: EditorCategory) {
    if (category.original) {
      category.edited = null;
      category.displayed = category.original;
    } else {
      this.categories.splice(this.categories.indexOf(category), 1);
    }
  }

  private newCategory() {
    let newCategory = new EditorCategory({
      id: -1,
      name: 'New Category',
      color: '#aaaaaa'
    });
    newCategory.original = null;
    newCategory.updateChanged();
    this.categories.push(newCategory);
  }

  private resetAll() {
    this.categories.forEach(category => {
      if (category.original) {
        this.reset(category);
      }
    });
    this.categories = this.categories.filter(category => category.original);
  }

  private save() {
    let createdCategories = this.categories
      .filter(category => category.changed && !category.original)
      .map(category => category.edited);
    let changedCategories = this.categories
      .filter(category => category.changed && category.original)
      .map(category => category.edited);
    let deletedCategories = this.categories
      .filter(category => !category.edited)
      .map(category => category.original);

    let pCreate = this.restService.createCategories(createdCategories);
    let pUpdate = this.restService.updateCategories(changedCategories);
    let pDelete = this.restService.deleteCategories(deletedCategories);

    Promise.all([pCreate, pUpdate, pDelete])
      .then(result => {
        this.success(`Categories saved successfully. (${createdCategories.length} created, ${changedCategories.length} updated, ${deletedCategories.length} deleted)`);
        this.loadCategories();
      })
      .catch(reason => {
        this.error(`Error: ${reason}`);
      });
  }

  error(message: string) {
    this.messageStream.next({ message: message, type: 'danger' });
  }

  success(message: string) {
    this.messageStream.next({ message: message, type: 'success' });
  }
}
