import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { OrderViewComponent } from "./order-view.component";
import { CardComponent } from "../card/card.component";
import { OrderComponent } from "../order/order.component";
import { NavbarComponent } from "../navbar/navbar.component";
import { RangePipe } from "../pipes/range.pipe";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { IterablePipe } from "../pipes/iterable.pipe";
import { RestService } from "../rest-service/rest.service";
import { PRODUCTS, PRODUCT_RANGES } from "../rest-service/mock-products";
import { Product } from "../product";
import { ProductRange } from "../product-range";

class RestServiceStub {
  getProductRangesMeta(): Promise<ProductRange[]> {
    return Promise.resolve(PRODUCT_RANGES);
  }

  getProducts(): Promise<Product[]> {
    return Promise.resolve(PRODUCTS);
  }
}

describe('OrderViewComponent', () => {
  let component: OrderViewComponent;
  let fixture: ComponentFixture<OrderViewComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        OrderViewComponent,
        CardComponent,
        OrderComponent,
        NavbarComponent,
        RangePipe,
        IterablePipe
      ],
      imports: [NgbModule.forRoot()],
      providers: [{ provide: RestService, useClass: RestServiceStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
