import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ViewUsersComponent } from './components/view-users/view-users.component';
import { ViewBuyersComponent } from './components/view-buyers/view-buyers.component';
import { ViewSellersComponent } from './components/view-sellers/view-sellers.component';
import { ViewProfitComponent } from './components/view-profit/view-profit.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { DeleteProjectComponent } from './components/delete-project/delete-project.component';
import { ViewProductComponent } from './view-products/view-products.component';
import { EditProductComponent } from './edit-product/edit-product.component';


const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'view-users', component: ViewUsersComponent },
  { path: 'view-buyers', component: ViewBuyersComponent },
  { path: 'view-sellers', component: ViewSellersComponent },
  { path: 'view-profit', component: ViewProfitComponent },
  { path: 'add-product', component: AddProductComponent },
  { path: 'view-products', component: ViewProductComponent },
  { path: 'delete-project', component: DeleteProjectComponent },
  { path: 'products', component: ViewProductComponent },
  { path: 'edit-product/:id', component: EditProductComponent },
  { path: '', redirectTo: '/products', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
