import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { KeypadComponent } from "./keypad.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

describe('KeypadComponent', () => {
  let component: KeypadComponent;
  let fixture: ComponentFixture<KeypadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KeypadComponent],
      providers: [NgbActiveModal]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KeypadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
