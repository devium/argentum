import {AbstractModel} from './abstract-model';
import {Observable} from 'rxjs';
import {MessageComponent} from '../message/message.component';

export namespace Editor {

  export class Entry<T extends AbstractModel> {
    public original: T;
    public active: T;

    constructor(
      private message: MessageComponent,
      source: T,
      private saveFun: ((original: T, active: T) => Observable<T>)
    ) {
      this.init(source);
    }

    init(source: T) {
      this.original = source;
      this.active = <T>source.clone();
    }

    changed(): boolean {
      return !this.original.equals(this.active) || this.original.id === undefined;
    }

    activeOption(fieldSpec: FieldSpec<T>): OptionSpec {
      if (this.active[fieldSpec.key] instanceof AbstractModel && this.active[fieldSpec.key] !== null) {
        return fieldSpec.params.optionSpecs.find((optionSpec: OptionSpec) => optionSpec.value.id === this.active[fieldSpec.key]['id']);
      } else {
        return fieldSpec.params.optionSpecs.find((optionSpec: OptionSpec) => optionSpec.value === this.active[fieldSpec.key]);
      }
    }

    save() {
      if (!this.changed()) {
        return;
      }
      this.saveFun(this.original, this.active).subscribe(
        (model: T) => this.init(model),
        (error: string) => this.message.error(error)
      );
    }

    reset() {
      this.init(this.original);
    }
  }

  export enum FieldType {
    ReadOnlyField,
    DateField,
    StringField,
    PasswordField,
    ColorField,
    CurrencyField,
    CardField,
    BalanceField,
    MultiCheckboxField,
    MultiModelCheckboxField,
    DropdownField
  }

  export class OptionSpec {
    constructor(
      public name: string,
      public value: any,
      public color?: string) {
    }
  }

  export interface Params<T extends AbstractModel> {
    optionSpecs?: OptionSpec[];
    filtered?: boolean;
    sortable?: boolean;
    filterKey?: string;
    minWidth?: number;
    disabled?: (entry: Entry<T>) => boolean;
    filterMap?: ((filter: string) => string);
  }

  export class FieldSpec<T extends AbstractModel> {
    public colspan: number;
    public optionsHeader = false;

    constructor(
      public name: string,
      public type: FieldType,
      public key: keyof T,
      public params: Params<T> = {}
    ) {
    }

    filterKey(): string {
      return this.params.filterKey ? this.params.filterKey : <string>this.key;
    }
  }

  export class Config<T extends AbstractModel> {
    public entries: Entry<T>[];
    public headerOptionRow = false;
    public headerFilterRow = false;
    public numCols = 0;
    public headerOptionSpecs: OptionSpec[] = [];
    public filters: Object = {};

    constructor(
      private message: MessageComponent,
      private source: ((filters?: Object) => Observable<T[]>),
      public saveFun: ((original: T, active: T) => Observable<T>),
      public removeFun: ((original: T) => Observable<null>),
      public defaultModel: T,
      public fieldSpecs: FieldSpec<T>[],
      public deleteDisabled: ((entry: Entry<T>) => boolean) = (entry: Entry<T>) => false
    ) {
      for (const fieldSpec of fieldSpecs) {
        if (fieldSpec.type === FieldType.MultiCheckboxField || fieldSpec.type === FieldType.MultiModelCheckboxField) {
          this.headerOptionRow = true;
          this.headerOptionSpecs = this.headerOptionSpecs.concat(fieldSpec.params.optionSpecs);
          fieldSpec.colspan = fieldSpec.params.optionSpecs.length;
          fieldSpec.optionsHeader = true;
        } else {
          fieldSpec.colspan = 1;
        }
        if (fieldSpec.params.filtered) {
          this.headerFilterRow = true;
        }
        this.numCols += fieldSpec.colspan;
      }
      this.reload();
    }

    reload() {
      let source$: Observable<T[]>;
      if (Object.values(this.filters)) {
        source$ = this.source(this.filters);
      } else {
        source$ = this.source();
      }
      source$.subscribe(
        (models: T[]) => this.entries = models.map((model: T) => new Entry(this.message, model, this.saveFun)),
        (error: string) => this.message.error(error)
      );
    }

    reset() {
      this.entries.forEach((entry: Entry<T>) => entry.reset());
    }

    create() {
      this.entries.push(new Entry(this.message, <T>this.defaultModel.clone(), this.saveFun));
    }

    remove(entry: Entry<T>) {
      if (entry.original.id === undefined) {
        const index = this.entries.indexOf(entry);
        this.entries.splice(index, 1);
      } else {
        this.removeFun(entry.original).subscribe(
          () => {
            const index = this.entries.indexOf(entry);
            this.entries.splice(index, 1);
          },
          (error: string) => this.message.error(error)
        );
      }
    }
  }

}
