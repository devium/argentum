import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CardBarComponent } from './card-bar.component';
import { RestService } from '../../common/rest-service/rest.service';
import { Guest } from '../../common/model/guest';
import { GUESTS } from '../../common/rest-service/mock-guests';

class RestServiceStub {
  getGuestByCard(card: string): Promise<Guest> {
    return Promise.resolve(GUESTS.find(guest => guest.card == card));
  }
}

describe('CardBarComponent', () => {
  let component: CardBarComponent;
  let fixture: ComponentFixture<CardBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardBarComponent],
      providers: [{ provide: RestService, useClass: RestServiceStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
