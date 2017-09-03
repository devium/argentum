import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusEditorComponent } from './status-editor.component';

describe('StatusEditorComponent', () => {
  let component: StatusEditorComponent;
  let fixture: ComponentFixture<StatusEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
