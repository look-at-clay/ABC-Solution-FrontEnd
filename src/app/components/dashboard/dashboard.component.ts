import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

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
  
  loading = true;
  error = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.fetchUserStats();
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

  refreshData(): void {
    this.fetchUserStats();
  }
}
