import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CategoryEditorComponent} from './category-editor.component';
import {Category} from '../../common/model/category';
import {AdminNavComponent} from '../admin-nav/admin-nav.component';
import {NavbarComponent} from '../../common/navbar/navbar.component';
import {Categories} from '../../common/rest-service/test-data/categories';

class RestServiceStub {
  getCategories(): Promise<Category[]> {
    return Promise.resolve(Categories.ALL);
  }
}

xdescribe('CategoryEditorComponent', () => {
  let component: CategoryEditorComponent;
  let fixture: ComponentFixture<CategoryEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CategoryEditorComponent,
        AdminNavComponent,
        NavbarComponent
      ],
      providers: []
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
