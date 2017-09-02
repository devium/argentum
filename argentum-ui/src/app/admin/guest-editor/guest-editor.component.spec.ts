import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GuestEditorComponent } from './guest-editor.component';

describe('GuestEditorComponent', () => {
  let component: GuestEditorComponent;
  let fixture: ComponentFixture<GuestEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuestEditorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
