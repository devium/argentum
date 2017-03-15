import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { OrderViewComponent } from "../order-view/order-view.component";
import { ProductEditorComponent } from "../product-editor/product-editor.component";
import { RangeEditorComponent } from "../range-editor/range-editor.component";
import { CategoryEditorComponent } from "../category-editor/category-editor.component";

const routes: Routes = [
  { path: '', redirectTo: '/order', pathMatch: 'full' },
  { path: 'order', component: OrderViewComponent },
  { path: 'admin', redirectTo: '/admin/products', pathMatch: 'full' },
  { path: 'admin/products', component: ProductEditorComponent },
  { path: 'admin/categories', component: CategoryEditorComponent },
  { path: 'admin/ranges', component: RangeEditorComponent }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
