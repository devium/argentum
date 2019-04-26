import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RangeEditorComponent } from './range-editor.component';
import { ProductRange } from '../../common/model/product-range';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import {ProductRanges} from '../../common/rest-service/test-data/product-ranges';

class RestServiceStub {
  getProductRangesMeta(): Promise<ProductRange[]> {
    return Promise.resolve(ProductRanges.ALL_META);
  }
}

xdescribe('RangeEditorComponent', () => {
  let component: RangeEditorComponent;
  let fixture: ComponentFixture<RangeEditorComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        RangeEditorComponent,
        AdminNavComponent,
        NavbarComponent
      ],
      providers: []
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
