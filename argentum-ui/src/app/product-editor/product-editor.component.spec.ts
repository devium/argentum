import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ProductEditorComponent } from "./product-editor.component";
import { RestService } from "../rest-service/rest.service";
import { ProductRange } from "../product-range";
import { PRODUCT_RANGES, PRODUCTS, CATEGORIES } from "../rest-service/mock-products";
import { Product } from "../product";
import { Category } from "../category";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbModalStack } from "@ng-bootstrap/ng-bootstrap/modal/modal-stack";

class RestServiceStub {
  getProductRangesMeta(): Promise<ProductRange[]> {
    return Promise.resolve(PRODUCT_RANGES);
  }

  getProducts(): Promise<Product[]> {
    return Promise.resolve(PRODUCTS);
  }

  getCategories(): Promise<Category[]> {
    return Promise.resolve(CATEGORIES);
  }
}

describe('ProductEditorComponent', () => {
  let component: ProductEditorComponent;
  let fixture: ComponentFixture<ProductEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductEditorComponent],
      providers: [
        { provide: RestService, useClass: RestServiceStub },
        NgbModal,
        NgbModalStack
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
