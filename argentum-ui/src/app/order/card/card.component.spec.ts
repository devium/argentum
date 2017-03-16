import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CardComponent } from "./card.component";
import { RestService } from "../../common/rest-service/rest.service";
import { Guest } from "../../common/model/guest";
import { GUESTS } from "../../common/rest-service/mock-data";

class RestServiceStub {
  getGuestByCard(card: string): Promise<Guest> {
    return Promise.resolve(GUESTS.find(guest => guest.card == card));
  }
}

describe('CardComponent', () => {
  let component: CardComponent;
  let fixture: ComponentFixture<CardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardComponent],
      providers: [{ provide: RestService, useClass: RestServiceStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
