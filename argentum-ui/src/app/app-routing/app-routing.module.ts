import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductEditorComponent } from '../admin/product-editor/product-editor.component';
import { RangeEditorComponent } from '../admin/range-editor/range-editor.component';
import { CategoryEditorComponent } from '../admin/category-editor/category-editor.component';
import { GuestEditorComponent } from '../admin/guest-editor/guest-editor.component';
import { GuestImportComponent } from '../admin/guest-import/guest-import.component';
import { CheckinComponent } from '../checkin/checkin/checkin.component';
import { OrderComponent } from '../order/order/order.component';
import { DashboardComponent } from '../admin/dashboard/dashboard.component';
import { ScanComponent } from '../scan/scan.component';
import { RouteGuard } from './route-guard';
import { LoginComponent } from '../login/login.component';
import { DummyComponent } from '../dummy/dummy.component';
import { UserEditorComponent } from '../admin/user-editor/user-editor.component';
import { ConfigComponent } from '../admin/config/config.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: DummyComponent, canActivate: [RouteGuard] },
  { path: 'login', component: LoginComponent, canActivate: [RouteGuard] },
  { path: 'logout', component: DummyComponent, canActivate: [RouteGuard] },
  { path: 'order', component: OrderComponent, canActivate: [RouteGuard] },
  { path: 'checkin', component: CheckinComponent, canActivate: [RouteGuard] },
  { path: 'scan', component: ScanComponent, canActivate: [RouteGuard] },
  { path: 'admin', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: [RouteGuard] },
  { path: 'admin/products', component: ProductEditorComponent, canActivate: [RouteGuard] },
  { path: 'admin/categories', component: CategoryEditorComponent, canActivate: [RouteGuard] },
  { path: 'admin/ranges', component: RangeEditorComponent, canActivate: [RouteGuard] },
  { path: 'admin/guests', component: GuestEditorComponent, canActivate: [RouteGuard] },
  { path: 'admin/import', component: GuestImportComponent, canActivate: [RouteGuard] },
  { path: 'admin/users', component: UserEditorComponent, canActivate: [RouteGuard] },
  { path: 'admin/config', component: ConfigComponent, canActivate: [RouteGuard] }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
