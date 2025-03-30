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
export class ViewUsersComponent implements OnInit {
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
        next: (data: User[]) => {
          // Filter out users where level is null
          this.users = data.filter(user => user.level !== null);
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load users: ' + (err.message || 'Unknown error');
          this.loading = false;
          console.error('Error fetching users:', err);
        }
      });
  }

  getLevelDisplay(level: Level): string {
    return `L${level.id}`;
  }

  refreshData(): void {
    this.fetchUsers();
  }

  editUser(user: User): void {
    console.log('Editing user:', user);
    // Add your edit logic here (e.g., navigate to edit form)
  }
}
