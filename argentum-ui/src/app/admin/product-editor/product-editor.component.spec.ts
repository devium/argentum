import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductEditorComponent } from './product-editor.component';
import { RestService } from '../../common/rest-service/rest.service';
import { ProductRange } from '../../common/model/product-range';
import { PRODUCT_RANGES, PRODUCTS, CATEGORIES } from '../../common/rest-service/mock-data';
import { Product } from '../../common/model/product';
import { Category } from '../../common/model/category';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalStack } from '@ng-bootstrap/ng-bootstrap/modal/modal-stack';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';

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
      declarations: [
        ProductEditorComponent,
        AdminNavComponent,
        NavbarComponent
      ],
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
