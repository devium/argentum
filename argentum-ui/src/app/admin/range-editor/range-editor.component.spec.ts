import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RangeEditorComponent } from './range-editor.component';
import { RestService } from '../../common/rest-service/rest.service';
import { ProductRange } from '../../common/model/product-range';
import { PRODUCT_RANGES } from '../../common/rest-service/mock-data';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';

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
      declarations: [
        RangeEditorComponent,
        AdminNavComponent,
        NavbarComponent
      ],
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
