import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ProductEditorComponent } from './product-editor.component';
import { RestService } from '../../common/rest-service/rest.service';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import createSpyObj = jasmine.createSpyObj;
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PRODUCTS } from '../../common/rest-service/mocks/mock-products';
import { CATEGORIES } from '../../common/rest-service/mocks/mock-categories';
import { PRODUCT_RANGES } from '../../common/rest-service/mocks/mock-ranges';
import { IterablePipe } from '../../common/pipes/iterable.pipe';
import { By } from '@angular/platform-browser';

@Component({selector: 'app-admin-nav', template: ''})
class AdminNavStubComponent {
}

@Component({selector: 'app-navbar', template: ''})
class NavbarStubComponent {
}

@Component({selector: 'app-message', template: ''})
class MessageStubComponent {
}

describe('ProductEditorComponent', () => {
  let component: ProductEditorComponent;
  let fixture: ComponentFixture<ProductEditorComponent>;

  const restService = createSpyObj('RestService', ['getProductData']);
  const modalService = createSpyObj('NgbModal', ['open']);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProductEditorComponent,
        AdminNavStubComponent,
        NavbarStubComponent,
        MessageStubComponent,
        IterablePipe
      ],
      imports: [
        FormsModule,
        NgbModule
      ],
      providers: [
        { provide: RestService, useValue: restService },
        { provide: NgbModal, useValue: modalService }
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductEditorComponent);
    component = fixture.componentInstance;
    restService.getProductData.and.returnValue(Promise.resolve({
      products: PRODUCTS,
      categories: CATEGORIES,
      ranges: PRODUCT_RANGES
    }));
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should properly list all products', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(component.categories.size).toBe(CATEGORIES.length);
    expect(component.products.length).toBe(PRODUCTS.length);
    expect(fixture.debugElement.query(By.css('#productsTable > tbody')).children.length).toBe(component.PAGE_SIZE);
  }));
});
