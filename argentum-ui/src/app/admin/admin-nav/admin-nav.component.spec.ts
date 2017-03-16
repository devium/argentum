import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminNavComponent } from "./admin-nav.component";
import { ProductEditorComponent } from "../product-editor/product-editor.component";
import { CategoryEditorComponent } from "../category-editor/category-editor.component";
import { RangeEditorComponent } from "../range-editor/range-editor.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NavbarComponent } from "../../common/navbar/navbar.component";
import { CATEGORIES, PRODUCTS, PRODUCT_RANGES } from "../../common/rest-service/mock-data";
import { Category } from "../../common/model/category";
import { Product } from "../../common/model/product";
import { ProductRange } from "../../common/model/product-range";
import { RestService } from "../../common/rest-service/rest.service";

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

describe('AdminNavComponent', () => {
  let component: AdminNavComponent;
  let fixture: ComponentFixture<AdminNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdminNavComponent,
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
    fixture = TestBed.createComponent(AdminNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
