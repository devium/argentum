import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {OrderPanelsComponent} from './common/order/order-panels/order-panels.component';
import {IterablePipe} from './common/pipes/iterable.pipe';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {KeypadModalComponent} from './common/keypad-modal/keypad-modal.component';
import {RangePipe} from './common/pipes/range.pipe';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {AdminNavComponent} from './admin/admin-nav/admin-nav.component';
import {ProductEditorComponent} from './admin/product-editor/product-editor.component';
import {NavbarComponent} from './common/navbar/navbar.component';
import {CategoryEditorComponent} from './admin/category-editor/category-editor.component';
import {RangeEditorComponent} from './admin/range-editor/range-editor.component';
import {GuestEditorComponent} from './admin/guest-editor/guest-editor.component';
import {GuestImportComponent} from './admin/guest-import/guest-import.component';
import {CheckinComponent} from './checkin/checkin/checkin.component';
import {NewGuestModalComponent} from './checkin/new-guest-modal/new-guest-modal.component';
import {SearchGuestModalComponent} from './checkin/search-guest-modal/search-guest-modal.component';
import {CardModalComponent} from './common/card-modal/card-modal.component';
import {MessageComponent} from './common/message/message.component';
import {DashboardComponent} from './admin/dashboard/dashboard.component';
import {DeleteGuestsModalComponent} from './admin/delete-guests-modal/delete-guests-modal.component';
import {ScanComponent} from './scan/scan.component';
import {RouteGuard} from './app-routing/route-guard';
import {LoginComponent} from './login/login.component';
import {DummyComponent} from './dummy/dummy.component';
import {UserEditorComponent} from './admin/user-editor/user-editor.component';
import {ConfigEditorComponent} from './admin/config-editor/config-editor.component';
import {GroupBasedComponent} from './common/group-based/group-based.component';
import {StatusEditorComponent} from './admin/status-editor/status-editor.component';
import {DiscountEditorComponent} from './admin/discount-editor/discount-editor.component';
import {OrderHistoryComponent} from './common/order/order-history/order-history.component';
import {OrderHistoryModalComponent} from './common/order/order-history-modal/order-history-modal.component';
import {ConfirmModalComponent} from './common/confirm-modal/confirm-modal.component';
import {PapaParseModule} from 'ngx-papaparse';
import {CoatCheckComponent} from './coat-check/coat-check.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BaseInterceptor} from './common/rest-service/base-interceptor';
import {EditorComponent} from './admin/editor/editor.component';
import {CardEntryComponent} from './common/card-entry/card-entry.component';
import {OrderSummaryModalComponent} from './common/order/order-summary-modal/order-summary-modal.component';
import {OrderComponent} from './order/order.component';

@NgModule({
  declarations: [
    AppComponent,
    CoatCheckComponent,
    OrderPanelsComponent,
    IterablePipe,
    KeypadModalComponent,
    RangePipe,
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
    DeleteGuestsModalComponent,
    ScanComponent,
    LoginComponent,
    DummyComponent,
    UserEditorComponent,
    ConfigEditorComponent,
    GroupBasedComponent,
    StatusEditorComponent,
    DiscountEditorComponent,
    OrderHistoryComponent,
    OrderHistoryModalComponent,
    ConfirmModalComponent,
    EditorComponent,
    CardEntryComponent,
    OrderSummaryModalComponent,
    OrderComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PapaParseModule
  ],
  providers: [
    RouteGuard,
    {provide: HTTP_INTERCEPTORS, useClass: BaseInterceptor, multi: true},
  ],
  bootstrap: [
    AppComponent
  ],
  entryComponents: [
    KeypadModalComponent,
    NewGuestModalComponent,
    SearchGuestModalComponent,
    CardModalComponent,
    DeleteGuestsModalComponent,
    OrderHistoryModalComponent,
    ConfirmModalComponent,
    OrderSummaryModalComponent
  ]
})
export class AppModule {
}
