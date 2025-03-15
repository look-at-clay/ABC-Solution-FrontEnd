import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Level } from '../../models/level.model';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-view-users',
  standalone: false,
  templateUrl: './view-users.component.html',
  styleUrl: './view-users.component.css'
})
export class ViewUsersComponent {
  users: User[] = [];
  loading = true;
  error = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.userService.getAllUsers()
      .subscribe({
        next: (data) => {
          this.users = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load users: ' + (err.message || 'Unknown error');
          this.loading = false;
          console.error('Error fetching users:', err);
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  getLevelDisplay(level: Level): string {
    return `L${level.id}`;
  }

  refreshData(): void {
    this.fetchUsers();
  }
}
