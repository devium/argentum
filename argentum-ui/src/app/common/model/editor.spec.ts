import {TestBed} from '@angular/core/testing';
import {Editor} from './editor';
import {AbstractModel} from './abstract-model';
import {of} from 'rxjs';

class Model extends AbstractModel {
  constructor(id: number, public value1: string, public value2: string) {
    super(id);
  }
}

fdescribe('Editor', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should initialize header values correctly', () => {
    let config = new Editor.Config<Model>(
      () => of([]),
      (original: Model, active: Model) => of(null),
      (original: Model) => of(null),
      new Model(undefined, 'New value 1', 'New value 2'),
      [
        new Editor.FieldSpec<Model>('Field1', Editor.StringField, 'value1'),
        new Editor.FieldSpec<Model>('Field2', Editor.StringField, 'value2')
      ]
    );
    expect(config.fieldSpecs[0].colspan).toEqual(1);
    expect(config.fieldSpecs[1].colspan).toEqual(1);


    config = new Editor.Config<Model>(
      () => of([]),
      (original: Model, active: Model) => of(null),
      (original: Model) => of(null),
      new Model(undefined, 'New value 1', 'New value 2'),
      [
        new Editor.FieldSpec<Model>(
          'Field1',
          Editor.MultiModelCheckboxField,
          'value1',
          [
            new Editor.OptionSpec('Option1', 'Option Value 1'),
            new Editor.OptionSpec('Option2', 'Option Value 2'),
            new Editor.OptionSpec('Option3', 'Option Value 3'),
          ]
        ),
        new Editor.FieldSpec<Model>('Field2', Editor.StringField, 'value2')
      ]
    );
    expect(config.numHeaderRows).toBe(2);
    expect(config.fieldSpecs[0].colspan).toEqual(3);
    expect(config.fieldSpecs[1].colspan).toEqual(1);
  });
});
