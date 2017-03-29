import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductEditorComponent } from '../admin/product-editor/product-editor.component';
import { RangeEditorComponent } from '../admin/range-editor/range-editor.component';
import { CategoryEditorComponent } from '../admin/category-editor/category-editor.component';
import { GuestEditorComponent } from '../admin/guest-editor/guest-editor.component';
import { GuestImportComponent } from '../admin/guest-import/guest-import.component';
import { ScanComponent } from '../checkin/checkin/scan.component';
import { OrderComponent } from '../order/order/order.component';
import { DashboardComponent } from '../admin/dashboard/dashboard.component';
import { BalanceComponent } from '../scan/balance.component';
import { RouteGuard } from './route-guard';
import { LoginComponent } from '../login/login.component';
import { DummyComponent } from '../dummy/dummy.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: DummyComponent, canActivate: [RouteGuard] },
  { path: 'login', component: LoginComponent, canActivate: [RouteGuard] },
  { path: 'logout', component: DummyComponent, canActivate: [RouteGuard] },
  { path: 'order', component: OrderComponent, canActivate: [RouteGuard] },
  { path: 'checkin', component: ScanComponent, canActivate: [RouteGuard] },
  { path: 'scan', component: BalanceComponent, canActivate: [RouteGuard] },
  { path: 'admin', redirectTo: '/admin/dashboard', pathMatch: 'full' },
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: [RouteGuard] },
  { path: 'admin/products', component: ProductEditorComponent, canActivate: [RouteGuard] },
  { path: 'admin/categories', component: CategoryEditorComponent, canActivate: [RouteGuard] },
  { path: 'admin/ranges', component: RangeEditorComponent, canActivate: [RouteGuard] },
  { path: 'admin/guests', component: GuestEditorComponent, canActivate: [RouteGuard] },
  { path: 'admin/import', component: GuestImportComponent, canActivate: [RouteGuard] }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
