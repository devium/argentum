import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RangeEditorComponent } from "./range-editor.component";

describe('RangeEditorComponent', () => {
  let component: RangeEditorComponent;
  let fixture: ComponentFixture<RangeEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RangeEditorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
