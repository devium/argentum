import {Component, OnInit, ViewChild} from '@angular/core';
import {Editor} from '../../common/model/editor';
import {CategoryService} from '../../common/rest-service/category.service';
import {Category} from '../../common/model/category';
import {MessageComponent} from '../../common/message/message.component';
import {EditorComponent} from '../editor/editor.component';
import {StatusService} from '../../common/rest-service/status.service';
import {Discount} from '../../common/model/discount';
import {DiscountService} from '../../common/rest-service/discount.service';
import {combineLatest} from 'rxjs';
import {Status} from '../../common/model/status';

@Component({
  selector: 'app-category-editor',
  templateUrl: 'discount-editor.component.html',
  styleUrls: ['discount-editor.component.scss']
})
export class DiscountEditorComponent implements OnInit {
  @ViewChild(EditorComponent)
  editor: EditorComponent;
  message: MessageComponent;

  editorConfig: Editor.Config<Discount>;

  constructor(
    private statusService: StatusService,
    private categoryService: CategoryService,
    private discountService: DiscountService
  ) {
  }

  ngOnInit() {
    this.message = this.editor.message;

    const statuses$ = this.statusService.list();
    const categories$ = this.categoryService.list();

    combineLatest(statuses$, categories$).subscribe(
      ([statuses, categories]: [Status[], Category[]]) => {
        if (statuses.length === 0 || categories.length === 0) {
          this.message.error('Statuses or categories missing. Please create some first.');
          return;
        }
        const statusOptions = statuses.map((status: Status) => new Editor.OptionSpec(status.displayName, status, status.color));
        const categoryOptions = categories.map((category: Category) => new Editor.OptionSpec(category.name, category, category.color));

        this.editorConfig = new Editor.Config<Discount>(
          this.message,
          () => this.discountService.list(statuses, categories),
          (original: Discount, active: Discount) => {
            if (active.id === undefined) {
              return this.discountService.create(active, statuses, categories);
            } else {
              return this.discountService.update(active, statuses, categories);
            }
          },
          (original: Discount) => this.discountService.delete(original),
          new Discount(undefined, statuses[0], categories[0], 0.00),
          [
            new Editor.FieldSpec<Discount>('ID', Editor.FieldType.ReadOnlyField, 'id'),
            new Editor.FieldSpec<Discount>('Status', Editor.FieldType.DropdownField, 'status',
              {optionSpecs: statusOptions}
              ),
            new Editor.FieldSpec<Discount>('Category', Editor.FieldType.DropdownField, 'category',
              {optionSpecs: categoryOptions}
              ),
            new Editor.FieldSpec<Discount>('Rate', Editor.FieldType.PercentageField, 'rate')
          ]
        );
      },
      (error: string) => this.message.error(error)
    );
  }
}
