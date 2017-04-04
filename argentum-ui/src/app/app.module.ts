import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { OrderComponent } from './order/order/order.component';
import { RestService } from './common/rest-service/rest.service';
import { IterablePipe } from './common/pipes/iterable.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { KeypadModalComponent } from './common/keypad-modal/keypad-modal.component';
import { RangePipe } from './common/pipes/range.pipe';
import { CardBarComponent } from './common/card-bar/card-bar.component';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { AdminNavComponent } from './admin/admin-nav/admin-nav.component';
import { ProductEditorComponent } from './admin/product-editor/product-editor.component';
import { NavbarComponent } from './common/navbar/navbar.component';
import { CategoryEditorComponent } from './admin/category-editor/category-editor.component';
import { RangeEditorComponent } from './admin/range-editor/range-editor.component';
import { GuestEditorComponent } from './admin/guest-editor/guest-editor.component';
import { GuestImportComponent } from './admin/guest-import/guest-import.component';
import { CheckinComponent } from './checkin/checkin/checkin.component';
import { NewGuestModalComponent } from './checkin/new-guest-modal/new-guest-modal.component';
import { SearchGuestModalComponent } from './checkin/search-guest-modal/search-guest-modal.component';
import { CardModalComponent } from './checkin/card-modal/card-modal.component';
import { MessageComponent } from './common/message/message.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { RefundModalComponent } from './checkin/refund-modal/refund-modal.component';
import { DeleteGuestsModalComponent } from './admin/delete-guests-modal/delete-guests-modal.component';
import { ScanComponent } from './scan/scan.component';
import { RouteGuard } from './app-routing/route-guard';
import { LoginComponent } from './login/login.component';
import { DummyComponent } from './dummy/dummy.component';
import { UserEditorComponent } from './admin/user-editor/user-editor.component';
import { ConfigComponent } from './admin/config/config.component';

@NgModule({
  declarations: [
    AppComponent,
    OrderComponent,
    IterablePipe,
    KeypadModalComponent,
    RangePipe,
    CardBarComponent,
    AdminNavComponent,
    ProductEditorComponent,
    NavbarComponent,
    CategoryEditorComponent,
    RangeEditorComponent,
    GuestEditorComponent,
    GuestImportComponent,
    CheckinComponent,
    NewGuestModalComponent,
    SearchGuestModalComponent,
    CardModalComponent,
    MessageComponent,
    DashboardComponent,
    RefundModalComponent,
    DeleteGuestsModalComponent,
    ScanComponent,
    LoginComponent,
    DummyComponent,
    UserEditorComponent,
    ConfigComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    RestService,
    RouteGuard
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    KeypadModalComponent,
    NewGuestModalComponent,
    SearchGuestModalComponent,
    CardModalComponent,
    RefundModalComponent,
    DeleteGuestsModalComponent
  ]
})
export class AppModule {
}
