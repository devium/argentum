import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettleModalComponent } from './settle-modal.component';

describe('SettleModalComponent', () => {
  let component: SettleModalComponent;
  let fixture: ComponentFixture<SettleModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettleModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
