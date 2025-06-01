import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ViewUsersComponent } from './components/view-users/view-users.component';
import { ViewBuyersComponent } from './components/view-buyers/view-buyers.component';
import { ViewSellersComponent } from './components/view-sellers/view-sellers.component';
import { ViewProfitComponent } from './components/view-profit/view-profit.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { DeleteProjectComponent } from './components/delete-project/delete-project.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { ViewProductComponent } from './components/view-products/view-products.component';
import { SellerProductsComponent } from './components/seller-products/seller-products.component';
import { LoginComponent } from './auth/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { BuyerProductsComponent } from './components/buyer-products/buyer-products.component';
import { ViewOngoingordersComponent } from './components/view-ongoingorders/view-ongoingorders.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'auth/login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'view-users', component: ViewUsersComponent, canActivate: [AuthGuard] },
  { path: 'view-buyers', component: ViewBuyersComponent, canActivate: [AuthGuard] },
  { path: 'view-sellers', component: ViewSellersComponent, canActivate: [AuthGuard] },
  { path: 'view-profit', component: ViewProfitComponent, canActivate: [AuthGuard] },
  { path: 'add-product', component: AddProductComponent, canActivate: [AuthGuard] },
  { path: 'view-products', component: ViewProductComponent, canActivate: [AuthGuard] },
  { path: 'delete-project', component: DeleteProjectComponent, canActivate: [AuthGuard] },
  { path: 'products', component: ViewProductComponent, canActivate: [AuthGuard] },
  { path: 'edit-product/:id', component: EditProductComponent, canActivate: [AuthGuard] },
  { path: 'seller-products/:sellerId', component: SellerProductsComponent, canActivate: [AuthGuard] },
  { path: 'buyer-products/:buyerId', component: BuyerProductsComponent, canActivate: [AuthGuard] },
  { path: 'view-ongoingorders', component: ViewOngoingordersComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }