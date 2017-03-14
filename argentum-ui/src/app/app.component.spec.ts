import { TestBed, async } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { Router } from "@angular/router";
import { AppRoutingModule } from "./app-routing/app-routing.module";
import { OrderViewComponent } from "./order-view/order-view.component";
import { AdminViewComponent } from "./admin-view/admin-view.component";
import { CardComponent } from "./card/card.component";
import { RangeEditorComponent } from "./range-editor/range-editor.component";
import { ProductEditorComponent } from "./product-editor/product-editor.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { OrderComponent } from "./order/order.component";
import { CategoryEditorComponent } from "./category-editor/category-editor.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RangePipe } from "./pipes/range.pipe";
import { IterablePipe } from "./pipes/iterable.pipe";

class RouterStub {
}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        OrderViewComponent,
        AdminViewComponent,
        CardComponent,
        OrderComponent,
        NavbarComponent,
        ProductEditorComponent,
        CategoryEditorComponent,
        RangeEditorComponent,
        IterablePipe,
        RangePipe
      ],
      providers: [
        { provide: Router, useClass: RouterStub }
      ],
      imports: [
        AppRoutingModule,
        NgbModule.forRoot()
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
