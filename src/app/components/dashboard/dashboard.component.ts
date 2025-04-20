import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { LevelService } from '../../services/level.services';
import { User } from '../../models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { LevelDialogueComponent } from '../../dialogue/level-dialogue/level-dialogue.component';
import { AuthService } from '../../services/auth.services';
import { ConfirmDialogueComponent } from '../../dialogue/confirm-dialogue/confirm-dialogue.component';
import { LevelAliasDialogueComponent } from '../../dialogue/level-alias-dialogue/level-alias-dialogue.component';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  totalUsers = 0;
  totalBuyers = 0;
  totalSellers = 0;
  totalProfit = 52500; 
  totalLevels = 0;
  
  loading = true;
  error = '';

  constructor(
    private userService: UserService,
    private levelService: LevelService,
    private dialog: MatDialog,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.fetchUserStats();
    this.fetchLevelCount();
  }

  fetchUserStats(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.totalUsers = users.length;
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

  openLevelDialog(): void {
    const dialogRef = this.dialog.open(LevelDialogueComponent, {
      width: '500px',
      data: { totalLevels: this.totalLevels }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Refresh data after dialog is closed
      this.fetchLevelCount();
    });
  }

  openLevelAliasDialog(): void {
    const dialogRef = this.dialog.open(LevelAliasDialogueComponent, {
      width: '500px',
      data: { levels: [] } // This will be populated in the dialog component
    });

    dialogRef.afterClosed().subscribe(result => {
      // No need to refresh anything here as aliases don't affect dashboard stats
    });
  }

  refreshData(): void {
    this.fetchUserStats();
    this.fetchLevelCount();
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
        // User confirmed logout
        this.authService.logout();
      }
    });
  }
}