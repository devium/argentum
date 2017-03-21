import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchGuestModalComponent } from './search-guest-modal.component';

describe('SearchGuestModalComponent', () => {
  let component: SearchGuestModalComponent;
  let fixture: ComponentFixture<SearchGuestModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchGuestModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchGuestModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
