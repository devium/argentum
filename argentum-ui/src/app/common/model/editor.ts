import {AbstractModel} from './abstract-model';
import {Observable} from 'rxjs';

export namespace Editor {

  export class Entry<T extends AbstractModel> {
    public original: T;
    public active: T;

    constructor(
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
        return fieldSpec.optionSpecs.find((optionSpec: OptionSpec) => optionSpec.value.id === this.active[fieldSpec.key]['id']);
      } else {
        return fieldSpec.optionSpecs.find((optionSpec: OptionSpec) => optionSpec.value === this.active[fieldSpec.key]);
      }
    }

    save() {
      if (!this.changed()) {
        return;
      }
      this.saveFun(this.original, this.active).subscribe((model: T) => {
        this.init(model);
      });
    }

    reset() {
      this.init(this.original);
    }
  }

  export enum FieldType {
    ReadOnlyField,
    StringField,
    ColorField,
    CurrencyField,
    CardField,
    BalanceField,
    MultiCheckboxField,
    DropdownField
  }

  export class OptionSpec {
    constructor(
      public name: string,
      public value: any,
      public color?: string) {
    }
  }

  export class FieldSpec<T extends AbstractModel> {
    public colspan: number;

    constructor(
      public name: string,
      public type: FieldType,
      public key: keyof T,
      public optionSpecs: OptionSpec[] = [],
      public filtered = false,
      public sortable = false,
      public minWidth: number = 0
    ) {
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
      private source: ((filters?: Object) => Observable<T[]>),
      public saveFun: ((original: T, active: T) => Observable<T>),
      public removeFun: ((original: T) => Observable<null>),
      public defaultModel: T,
      public fieldSpecs: FieldSpec<T>[]
    ) {
      for (const fieldSpec of fieldSpecs) {
        if (fieldSpec.type === FieldType.MultiCheckboxField) {
          this.headerOptionRow = true;
          this.headerOptionSpecs = this.headerOptionSpecs.concat(fieldSpec.optionSpecs);
          fieldSpec.colspan = fieldSpec.optionSpecs.length;
        } else {
          fieldSpec.colspan = 1;
        }
        if (fieldSpec.filtered) {
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
      source$.subscribe((models: T[]) => {
        this.entries = models.map((model: T) => new Entry(model, this.saveFun));
      });
    }

    reset() {
      this.entries.forEach((entry: Entry<T>) => entry.reset());
    }

    create() {
      this.entries.push(new Entry(<T>this.defaultModel.clone(), this.saveFun));
    }

    remove(entry: Entry<T>) {
      if (entry.original.id === undefined) {
        const index = this.entries.indexOf(entry);
        this.entries.splice(index, 1);
      } else {
        this.removeFun(entry.original).subscribe(() => {
          const index = this.entries.indexOf(entry);
          this.entries.splice(index, 1);
        });
      }
    }
  }

}
