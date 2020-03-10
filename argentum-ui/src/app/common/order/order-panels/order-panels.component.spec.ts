import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderPanelsComponent } from './order-panels.component';
import { IterablePipe } from '../../pipes/iterable.pipe';
import { RangePipe } from '../../pipes/range.pipe';
import { ProductRange } from '../../model/product-range';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ProductRanges} from '../../rest-service/test-data/product-ranges';

class RestServiceStub {
  getProductRangesMeta(): Promise<ProductRange[]> {
    return Promise.resolve(ProductRanges.ALL_META);
  }

  getProductRangeEager(id: number): Promise<ProductRange> {
    return Promise.resolve(ProductRanges.ALL.find((productRange: ProductRange) => productRange.id === id));
  }
}

xdescribe('OrderComponent', () => {
  let component: OrderPanelsComponent;
  let fixture: ComponentFixture<OrderPanelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrderPanelsComponent,
        IterablePipe,
        RangePipe
      ],
      imports: [NgbModule],
      providers: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPanelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
