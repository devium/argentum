import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderComponent } from './order.component';
import { IterablePipe } from '../../common/pipes/iterable.pipe';
import { RangePipe } from '../../common/pipes/range.pipe';
import { ProductRange } from '../../common/model/product-range';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {ProductRanges} from '../../common/rest-service/test-data/product-ranges';

class RestServiceStub {
  getProductRangesMeta(): Promise<ProductRange[]> {
    return Promise.resolve(ProductRanges.ALL_META);
  }

  getProductRangeEager(id: number): Promise<ProductRange> {
    return Promise.resolve(ProductRanges.ALL.find((productRange: ProductRange) => productRange.id === id));
  }
}

xdescribe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrderComponent,
        IterablePipe,
        RangePipe
      ],
      imports: [NgbModule],
      providers: []
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
