import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryEditorComponent } from './category-editor.component';
import { Category } from '../../common/model/category';
import { RestService } from '../../common/rest-service/rest.service';
import { AdminNavComponent } from '../admin-nav/admin-nav.component';
import { NavbarComponent } from '../../common/navbar/navbar.component';
import { CATEGORIES } from '../../common/rest-service/mocks/mock-categories';

class RestServiceStub {
  getCategories(): Promise<Category[]> {
    return Promise.resolve(CATEGORIES);
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
      providers: [{ provide: RestService, useClass: RestServiceStub }]
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
