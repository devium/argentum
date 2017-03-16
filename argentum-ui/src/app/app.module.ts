import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { AppComponent } from "./app.component";
import { OrderComponent } from "./order/order.component";
import { RestService } from "./rest-service/rest.service";
import { IterablePipe } from "./pipes/iterable.pipe";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { KeypadComponent } from "./keypad/keypad.component";
import { RangePipe } from "./pipes/range.pipe";
import { CardComponent } from "./card/card.component";
import { OrderViewComponent } from "./order-view/order-view.component";
import { AppRoutingModule } from "./app-routing/app-routing.module";
import { AdminNavComponent } from "./admin-nav/admin-nav.component";
import { ProductEditorComponent } from "./product-editor/product-editor.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { CategoryEditorComponent } from "./category-editor/category-editor.component";
import { RangeEditorComponent } from "./range-editor/range-editor.component";

@NgModule({
  declarations: [
    AppComponent,
    OrderComponent,
    IterablePipe,
    KeypadComponent,
    RangePipe,
    CardComponent,
    OrderViewComponent,
    AdminNavComponent,
    ProductEditorComponent,
    NavbarComponent,
    CategoryEditorComponent,
    RangeEditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    RestService
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    KeypadComponent
  ]
})
export class AppModule {
}
