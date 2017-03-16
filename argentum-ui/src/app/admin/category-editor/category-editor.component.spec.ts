import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { CategoryEditorComponent } from "./category-editor.component";
import { CATEGORIES } from "../rest-service/mock-data";
import { Category } from "../category";
import { RestService } from "../rest-service/rest.service";

class RestServiceStub {
  getCategories(): Promise<Category[]> {
    return Promise.resolve(CATEGORIES);
  }
}

describe('CategoryEditorComponent', () => {
  let component: CategoryEditorComponent;
  let fixture: ComponentFixture<CategoryEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryEditorComponent],
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
