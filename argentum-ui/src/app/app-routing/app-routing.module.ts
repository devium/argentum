import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { OrderViewComponent } from "../order-view/order-view.component";

const routes: Routes = [
  { path: '', redirectTo: '/order', pathMatch: 'full' },
  { path: 'order', component: OrderViewComponent }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
