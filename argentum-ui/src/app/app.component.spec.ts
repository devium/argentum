import { TestBed, async } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { Router } from "@angular/router";
import { AppRoutingModule } from "./app-routing/app-routing.module";
import { OrderViewComponent } from "./order/order-view/order-view.component";
import { AdminNavComponent } from "./admin/admin-nav/admin-nav.component";
import { CardComponent } from "./order/card/card.component";
import { RangeEditorComponent } from "./admin/range-editor/range-editor.component";
import { ProductEditorComponent } from "./admin/product-editor/product-editor.component";
import { NavbarComponent } from "./common/navbar/navbar.component";
import { OrderComponent } from "./order/order/order.component";
import { CategoryEditorComponent } from "./admin/category-editor/category-editor.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RangePipe } from "./common/pipes/range.pipe";
import { IterablePipe } from "./common/pipes/iterable.pipe";

class RouterStub {
}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        OrderViewComponent,
        AdminNavComponent,
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
