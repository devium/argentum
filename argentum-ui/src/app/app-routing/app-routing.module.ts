import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { OrderViewComponent } from "../order-view/order-view.component";
import { AdminViewComponent } from "../admin-view/admin-view.component";

const routes: Routes = [
  { path: '', redirectTo: '/order', pathMatch: 'full' },
  { path: 'order', component: OrderViewComponent },
  { path: 'admin', component: AdminViewComponent }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
