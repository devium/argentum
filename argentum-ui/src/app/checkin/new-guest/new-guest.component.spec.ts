import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NewGuestComponent } from './new-guest.component';

describe('NewGuestComponent', () => {
  let component: NewGuestComponent;
  let fixture: ComponentFixture<NewGuestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewGuestComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
