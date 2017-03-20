import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchGuestComponent } from './search-guest.component';

describe('SearchGuestComponent', () => {
  let component: SearchGuestComponent;
  let fixture: ComponentFixture<SearchGuestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchGuestComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchGuestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
