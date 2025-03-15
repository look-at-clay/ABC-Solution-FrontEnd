import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ViewUsersComponent } from './components/view-users/view-users.component';
import { ViewBuyersComponent } from './components/view-buyers/view-buyers.component';
import { ViewSellersComponent } from './components/view-sellers/view-sellers.component';
import { ViewProfitComponent } from './components/view-profit/view-profit.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { DeleteProjectComponent } from './components/delete-project/delete-project.component';
import { ViewProductComponent } from './view-products/view-products.component';
import { EditProductComponent } from './edit-product/edit-product.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    DashboardComponent,
    ViewUsersComponent,
    ViewBuyersComponent,
    ViewSellersComponent,
    ViewProfitComponent,
    AddProductComponent,
    DeleteProjectComponent,
    ViewProductComponent,
    EditProductComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatButtonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
