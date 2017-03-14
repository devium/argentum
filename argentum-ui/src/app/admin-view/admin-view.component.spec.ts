import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminViewComponent } from "./admin-view.component";
import { ProductEditorComponent } from "../product-editor/product-editor.component";
import { CategoryEditorComponent } from "../category-editor/category-editor.component";
import { RangeEditorComponent } from "../range-editor/range-editor.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NavbarComponent } from "../navbar/navbar.component";
import { CATEGORIES, PRODUCTS, PRODUCT_RANGES } from "../rest-service/mock-data";
import { Category } from "../category";
import { Product } from "../product";
import { ProductRange } from "../product-range";
import { RestService } from "../rest-service/rest.service";

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

describe('AdminViewComponent', () => {
  let component: AdminViewComponent;
  let fixture: ComponentFixture<AdminViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdminViewComponent,
        ProductEditorComponent,
        CategoryEditorComponent,
        RangeEditorComponent,
        NavbarComponent
      ],
      imports: [
        NgbModule.forRoot()
      ],
      providers: [{ provide: RestService, useClass: RestServiceStub }]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
