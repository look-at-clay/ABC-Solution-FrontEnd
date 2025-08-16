import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
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
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { SellerProductsComponent } from './components/seller-products/seller-products.component';
import { ViewProductComponent } from './components/view-products/view-products.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthModule } from './auth/auth.module';
import { LevelDialogueComponent } from './dialogue/level-dialogue/level-dialogue.component';
import { ConfirmDialogueComponent } from './dialogue/confirm-dialogue/confirm-dialogue.component';
import { LevelAliasDialogueComponent } from './dialogue/level-alias-dialogue/level-alias-dialogue.component';
import { BuyerProductsComponent } from './components/buyer-products/buyer-products.component';
import { ViewOngoingordersComponent } from './components/view-ongoingorders/view-ongoingorders.component';
import { UserLevelStatsDialogueComponent } from './dialogue/user-level-stats-dialogue/user-level-stats-dialogue.component';
import { OrderStatsDialogueComponent } from './dialogue/order-stats-dialogue/order-stats-dialogue.component';
import { FilterPipe } from './pipes/filter.pipes';
import { CombinedRequestsDialogueComponent } from './dialogue/combined-requests-dialogue/combined-requests-dialogue.component';
import { CategoryManagementDialogueComponent } from './dialogue/category-management-dialogue/category-management-dialogue.component';
import { NewsManagementComponent } from './components/news-management/news-management.component';
import { ProductCategoryComponent } from './components/product-category/product-category.component';
import { NegotiationQuestionsComponent } from './components/negotiation-questions/negotiation-questions.component';
import { ProductTradingCardComponent } from './components/product-trading-card/product-trading-card.component';
import { ProductTradingSidePanelComponent } from './components/product-trading-side-panel/product-trading-side-panel.component';
import { ReportsStatsComponent } from './components/reports-stats/reports-stats.component';

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
    ViewProductComponent,
    EditProductComponent,
    SellerProductsComponent,
    LevelDialogueComponent,
    ConfirmDialogueComponent,
    LevelAliasDialogueComponent,
    BuyerProductsComponent,
    ViewOngoingordersComponent,
    UserLevelStatsDialogueComponent,
    OrderStatsDialogueComponent,
    CombinedRequestsDialogueComponent,
    CategoryManagementDialogueComponent,
    NewsManagementComponent,
    ProductCategoryComponent,
    NegotiationQuestionsComponent,
    ProductTradingCardComponent,
    ProductTradingSidePanelComponent,
    ReportsStatsComponent,
    FilterPipe,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
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