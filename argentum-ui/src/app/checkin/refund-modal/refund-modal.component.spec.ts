import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundModalComponent } from './refund-modal.component';

describe('RefundModalComponent', () => {
  let component: RefundModalComponent;
  let fixture: ComponentFixture<RefundModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RefundModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
