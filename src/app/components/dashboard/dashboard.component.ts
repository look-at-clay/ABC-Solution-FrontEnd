import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { LevelService } from '../../services/level.services';
import { CategoryService } from '../../services/category.services';
import { ProductService } from '../../services/product.services';
import { User } from '../../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { LevelDialogueComponent } from '../../dialogue/level-dialogue/level-dialogue.component';
import { UserLevelStatsDialogueComponent } from '../../dialogue/user-level-stats-dialogue/user-level-stats-dialogue.component';
import { OrderStatsDialogueComponent } from '../../dialogue/order-stats-dialogue/order-stats-dialogue.component';
import { CategoryManagementDialogueComponent } from '../../dialogue/category-management-dialogue/category-management-dialogue.component';
import { AuthService } from '../../services/auth.services';
import { ConfirmDialogueComponent } from '../../dialogue/confirm-dialogue/confirm-dialogue.component';
import { LevelAliasDialogueComponent } from '../../dialogue/level-alias-dialogue/level-alias-dialogue.component';
import { AdminService } from '../../services/admin.services';
import { UserLevelStats } from '../../models/user-stats.mode';
import { OrderStatistics } from '../../models/order-stat.model';
import { CombinedRequestStats } from '../../models/request-stats.model';
import { CombinedRequestsDialogueComponent } from '../../dialogue/combined-requests-dialogue/combined-requests-dialogue.component';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  totalUsers = 0;
  totalBuyers = 0;
  totalSellers = 0;
  totalProfit = 52500;
  totalLevels = 0;
  totalOrders = 0;
  totalCategories = 0;
  userLevelStats: UserLevelStats | null = null;
  orderStatistics: OrderStatistics | null = null;
  combinedRequestStats: CombinedRequestStats | null = null;
  totalOpenRequests = 0;
  
  // Product trading side panel properties
  showProductTradingSidePanel = false;
  selectedProductForTrading: any = null;
  
  loading = true;
  error = '';

  constructor(
    private userService: UserService,
    private levelService: LevelService,
    private categoryService: CategoryService,
    private productService: ProductService,
    private dialog: MatDialog,
    private authService: AuthService,
    private adminService: AdminService,
  ) { }

  ngOnInit(): void {
    this.fetchUserStats();
    this.fetchUserLevelStats();
    this.fetchLevelCount();
    this.fetchOrderStatistics(); 
    this.fetchCombinedRequestStats();
    this.fetchCategoryCount();
  }

  // Add this new method
  fetchCombinedRequestStats(): void {
    this.adminService.getCombinedRequestStats().subscribe({
      next: (stats: CombinedRequestStats) => {
        this.combinedRequestStats = stats;
        this.totalOpenRequests = 
          stats.buyerStats.totalBuyerRequests + 
          stats.sellerStats.totalSellerRequests;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load request statistics';
        this.loading = false;
        console.error('Error fetching request stats:', error);
      }
    });
  }

  // Add this new method
  openCombinedRequestsDialog(): void {
    if (!this.combinedRequestStats) {
      this.error = 'Request statistics not available';
      return;
    }

    const dialogRef = this.dialog.open(CombinedRequestsDialogueComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: this.combinedRequestStats,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any post-dialog actions if needed
    });
  }

  fetchUserStats(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.totalBuyers = users.filter(user => user.role === 'BUYER').length;
        this.totalSellers = users.filter(user => user.role === 'SELLER').length;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load user statistics';
        this.loading = false;
        console.error('Error fetching user stats:', err);
      }
    });
  }

  fetchUserLevelStats(): void {
    this.adminService.getUserLevelStats().subscribe({
      next: (stats: UserLevelStats) => {
        this.userLevelStats = stats;
        this.totalUsers = stats.totalUsers;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load user level statistics';
        this.loading = false;
        console.error('Error fetching user level stats:', error);
      }
    });
  }

  // Add this new method
  fetchOrderStatistics(): void {
    this.adminService.getOrderStatistics().subscribe({
      next: (stats: OrderStatistics) => {
        this.orderStatistics = stats;
        this.totalOrders = stats.totalOrders;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load order statistics';
        this.loading = false;
        console.error('Error fetching order statistics:', error);
      }
    });
  }

  fetchLevelCount(): void {
    this.levelService.getAllLevels().subscribe({
      next: (levels) => {
        this.totalLevels = levels.length;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load level data';
        this.loading = false;
        console.error('Error fetching level data:', err);
      },
    });
  }

  openUserLevelStatsDialog(): void {
    if (!this.userLevelStats) {
      this.error = 'User level statistics not available';
      return;
    }

    const dialogRef = this.dialog.open(UserLevelStatsDialogueComponent, {
      width: '600px',
      data: this.userLevelStats,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any post-dialog actions if needed
    });
  }

  // Add this new method
  openOrderStatisticsDialog(): void {
    if (!this.orderStatistics) {
      this.error = 'Order statistics not available';
      return;
    }

    const dialogRef = this.dialog.open(OrderStatsDialogueComponent, {
      width: '800px',
      maxWidth: '90vw',
      data: this.orderStatistics,
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      // Handle any post-dialog actions if needed
    });
  }

  openLevelDialog(): void {
    const dialogRef = this.dialog.open(LevelDialogueComponent, {
      width: '500px',
      data: { totalLevels: this.totalLevels }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fetchLevelCount();
    });
  }

  openLevelAliasDialog(): void {
    const dialogRef = this.dialog.open(LevelAliasDialogueComponent, {
      width: '500px',
      data: { levels: [] }
    });

    dialogRef.afterClosed().subscribe(result => {
      // No need to refresh anything here as aliases don't affect dashboard stats
    });
  }

  fetchCategoryCount(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.totalCategories = categories.length;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load category data';
        this.loading = false;
        console.error('Error fetching category data:', err);
      }
    });
  }

  openCategoryManagementDialog(): void {
    const dialogRef = this.dialog.open(CategoryManagementDialogueComponent, {
      width: '1000px',
      maxWidth: '95vw',
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result => {
      this.fetchCategoryCount(); // Refresh category count after dialog closes
    });
  }

  refreshData(): void {
    this.fetchUserStats();
    this.fetchUserLevelStats();
    this.fetchLevelCount();
    this.fetchOrderStatistics();
    this.fetchCombinedRequestStats();
    this.fetchCategoryCount();
  }

  onLogout(): void {
    const dialogRef = this.dialog.open(ConfirmDialogueComponent, {
      width: '400px',
      data: {
        title: 'Confirm Logout',
        message: 'Are you sure you want to log out?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.logout();
      }
    });
  }

  // Product trading methods
  onProductSelected(event: any): void {
    const productId = event.target?.value || event;
    if (productId) {
      // Find the selected product from the products list
      this.productService.getProductById(productId).subscribe({
        next: (product) => {
          this.selectedProductForTrading = product;
          this.showProductTradingSidePanel = true;
        },
        error: (error) => {
          console.error('Error fetching product details:', error);
        }
      });
    }
  }

  onCloseTradingSidePanel(): void {
    this.showProductTradingSidePanel = false;
    this.selectedProductForTrading = null;
  }
}
