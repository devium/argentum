import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RangeEditorComponent } from "./range-editor.component";
import { RestService } from "../rest-service/rest.service";
import { ProductRange } from "../product-range";
import { PRODUCT_RANGES } from "../rest-service/mock-products";

class RestServiceStub {
  getProductRangesMeta(): Promise<ProductRange[]> {
    return Promise.resolve(PRODUCT_RANGES);
  }
}

describe('RangeEditorComponent', () => {
  let component: RangeEditorComponent;
  let fixture: ComponentFixture<RangeEditorComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [RangeEditorComponent],
      providers: [{ provide: RestService, useClass: RestServiceStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
