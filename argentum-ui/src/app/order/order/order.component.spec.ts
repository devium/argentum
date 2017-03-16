import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { OrderComponent } from "./order.component";
import { IterablePipe } from "../../shared/pipes/iterable.pipe";
import { RangePipe } from "../../shared/pipes/range.pipe";
import { PRODUCT_RANGES } from "../../shared/rest-service/mock-data";
import { ProductRange } from "../../shared/model/product-range";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RestService } from "../../shared/rest-service/rest.service";

class RestServiceStub {
  getProductRangesMeta(): Promise<ProductRange[]> {
    return Promise.resolve(PRODUCT_RANGES);
  }

  getProductRangeEager(id: number): Promise<ProductRange> {
    return Promise.resolve(PRODUCT_RANGES.find(range => range.id == id));
  }
}

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrderComponent,
        IterablePipe,
        RangePipe
      ],
      imports: [NgbModule.forRoot()],
      providers: [{ provide: RestService, useClass: RestServiceStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
