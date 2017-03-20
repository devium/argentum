import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductEditorComponent } from '../admin/product-editor/product-editor.component';
import { RangeEditorComponent } from '../admin/range-editor/range-editor.component';
import { CategoryEditorComponent } from '../admin/category-editor/category-editor.component';
import { GuestEditorComponent } from '../admin/guest-editor/guest-editor.component';
import { GuestImportComponent } from '../admin/guest-import/guest-import.component';
import { CheckinComponent } from '../checkin/checkin.component';
import { OrderComponent } from '../order/order/order.component';

const routes: Routes = [
  { path: '', redirectTo: '/order', pathMatch: 'full' },
  { path: 'order', component: OrderComponent },
  { path: 'checkin', component: CheckinComponent },
  { path: 'admin', redirectTo: '/admin/products', pathMatch: 'full' },
  { path: 'admin/products', component: ProductEditorComponent },
  { path: 'admin/categories', component: CategoryEditorComponent },
  { path: 'admin/ranges', component: RangeEditorComponent },
  { path: 'admin/guests', component: GuestEditorComponent },
  { path: 'admin/import', component: GuestImportComponent }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
