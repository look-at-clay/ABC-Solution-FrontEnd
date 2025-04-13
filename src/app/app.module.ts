import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog'; // Add this import
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 

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
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { SellerProductsComponent } from './components/seller-products/seller-products.component';
import { ViewProductComponent } from './components/view-products/view-products.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthModule } from './auth/auth.module';
import { LevelDialogueComponent } from './dialogue/level-dialogue/level-dialogue.component';

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
    EditProductComponent,
    SellerProductsComponent,
    LevelDialogueComponent // Add this component
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule, // Add this module
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    FormsModule, 
    AuthModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }