import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewGuestModalComponent } from './new-guest-modal.component';

xdescribe('NewGuestModalComponent', () => {
  let component: NewGuestModalComponent;
  let fixture: ComponentFixture<NewGuestModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewGuestModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGuestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
