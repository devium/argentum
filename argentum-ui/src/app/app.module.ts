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

@NgModule({
  declarations: [
    AppComponent,
    OrderComponent,
    IterablePipe,
    KeypadComponent,
    RangePipe,
    CardComponent,
    OrderViewComponent
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
