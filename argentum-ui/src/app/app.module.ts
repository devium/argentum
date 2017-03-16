import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { AppComponent } from "./app.component";
import { OrderComponent } from "./order/order/order.component";
import { RestService } from "./common/rest-service/rest.service";
import { IterablePipe } from "./common/pipes/iterable.pipe";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { KeypadComponent } from "./common/keypad/keypad.component";
import { RangePipe } from "./common/pipes/range.pipe";
import { CardComponent } from "./order/card/card.component";
import { OrderViewComponent } from "./order/order-view/order-view.component";
import { AppRoutingModule } from "./app-routing/app-routing.module";
import { AdminNavComponent } from "./admin/admin-nav/admin-nav.component";
import { ProductEditorComponent } from "./admin/product-editor/product-editor.component";
import { NavbarComponent } from "./common/navbar/navbar.component";
import { CategoryEditorComponent } from "./admin/category-editor/category-editor.component";
import { RangeEditorComponent } from "./admin/range-editor/range-editor.component";
import { GuestEditorComponent } from "./admin/guest-editor/guest-editor.component";

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
    RangeEditorComponent,
    GuestEditorComponent
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
