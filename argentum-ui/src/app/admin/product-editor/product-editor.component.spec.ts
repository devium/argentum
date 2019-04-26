import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ProductEditorComponent} from './product-editor.component';
import {NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import createSpyObj = jasmine.createSpyObj;
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {IterablePipe} from '../../common/pipes/iterable.pipe';
import {By} from '@angular/platform-browser';
import {ProductRanges} from '../../common/rest-service/test-data/product-ranges';
import {Categories} from '../../common/rest-service/test-data/categories';
import {Products} from '../../common/rest-service/test-data/products';

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
        {provide: NgbModal, useValue: modalService}
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductEditorComponent);
    component = fixture.componentInstance;
    restService.getProductData.and.returnValue(Promise.resolve({
      products: Products.ALL,
      categories: Categories.ALL,
      ranges: ProductRanges.ALL_META
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
    expect(component.categories.size).toBe(Categories.ALL.length);
    expect(component.products.length).toBe(Products.ALL.length);
    expect(fixture.debugElement.query(By.css('#productsTable > tbody')).children.length).toBe(component.PAGE_SIZE);
  }));
});
