import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { AppComponent } from "./app.component";
import { OrderComponent } from "./order/order.component";
import { ProductService } from "./product.service";
import { IterablePipe } from "./iterable.pipe";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { KeypadComponent } from "./keypad/keypad.component";
import { RangePipe } from "./range.pipe";

@NgModule({
  declarations: [
    AppComponent,
    OrderComponent,
    IterablePipe,
    KeypadComponent,
    RangePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot()
  ],
  providers: [
    ProductService
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
