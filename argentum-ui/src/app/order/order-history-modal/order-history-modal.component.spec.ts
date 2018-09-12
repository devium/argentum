import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderHistoryModalComponent } from './order-history-modal.component';

xdescribe('OrderHistoryModalComponent', () => {
  let component: OrderHistoryModalComponent;
  let fixture: ComponentFixture<OrderHistoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderHistoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
