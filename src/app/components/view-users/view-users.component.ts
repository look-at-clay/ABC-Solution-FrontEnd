// view-users.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Level } from '../../models/level.model';
import { UserService } from '../../services/user.service';
import { AdminService } from '../../services/admin.services';
import { AdminUser } from '../../models/adminuser.model';

@Component({
  selector: 'app-view-users',
  standalone: false,
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit {
  users: AdminUser[] = [];
  filteredUsers: AdminUser[] = [];
  loading = true;
  error = '';
  searchTerm = '';
  
  // Filter properties
  selectedRegion = '';
  selectedLevel = '';
  selectedStatus = '';
  
  // Sorting properties
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // Modal properties
  showUserModal = false;
  selectedUser: AdminUser | null = null;
  
  // Filter options
  regionOptions: string[] = [];
  levelOptions = [
    { value: '', label: 'All Levels' },
    { value: '1', label: 'Level 1' },
    { value: '2', label: 'Level 2' },
    { value: '3', label: 'Level 3' }
  ];
  statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'blocked', label: 'Blocked' }
  ];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading = true;
    this.adminService.getAllUsers()
      .subscribe({
        next: (data: AdminUser[]) => {
          // Filter out users where level is null
          this.users = data.filter(user => user.level !== null);
          this.extractRegionOptions();
          this.applyFilters();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load users: ' + (err.message || 'Unknown error');
          this.loading = false;
          console.error('Error fetching users:', err);
        }
      });
  }

  extractRegionOptions(): void {
    const regions = new Set<string>();
    
    // Add 'All Regions' as the default option
    regions.add('All Regions');
    
    // Extract unique regions from user addresses
    this.users.forEach(user => {
      if (user.addresses && Array.isArray(user.addresses)) {
        user.addresses.forEach(address => {
          if (address && address.state) {
            regions.add(address.state);
          }
        });
      }
    });
    
    // Convert Set to sorted Array, ensuring 'All Regions' is first
    this.regionOptions = Array.from(regions);
    if (this.regionOptions.includes('All Regions')) {
      // Remove 'All Regions' from its current position
      this.regionOptions = this.regionOptions.filter(region => region !== 'All Regions');
      // Add it back at the beginning
      this.regionOptions.unshift('All Regions');
    }
  }

  onSearchChange(event?: any): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.users];

    // Apply search filter
    if (this.searchTerm.trim()) {
      const searchLower = this.searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        user.phoneNumber.includes(searchLower) ||
        user.id.toString().includes(searchLower) ||
        (user.referralCode && user.referralCode.toLowerCase().includes(searchLower)) ||
        (user.referredBy && (user.referredBy.name.toLowerCase().includes(searchLower) || user.referredBy.email.toLowerCase().includes(searchLower)))
      );
    }

    // Apply region filter
    if (this.selectedRegion && this.selectedRegion !== 'All Regions') {
      filtered = filtered.filter(user => 
        user.addresses.some(address => address.state === this.selectedRegion)
      );
    }

    // Apply level filter
    if (this.selectedLevel) {
      filtered = filtered.filter(user => user.level.id.toString() === this.selectedLevel);
    }

    // Apply status filter
    if (this.selectedStatus) {
      if (this.selectedStatus === 'active') {
        filtered = filtered.filter(user => !user.isBlocked && !user.blocked);
      } else if (this.selectedStatus === 'blocked') {
        filtered = filtered.filter(user => user.isBlocked || user.blocked);
      }
    }

    this.filteredUsers = filtered;
    this.applySorting();
  }

  sortBy(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applySorting();
  }

  applySorting(): void {
    if (!this.sortColumn) return;

    this.filteredUsers.sort((a, b) => {
      let valueA: any;
      let valueB: any;

      switch (this.sortColumn) {
        case 'name':
          valueA = a.name.toLowerCase();
          valueB = b.name.toLowerCase();
          break;
        case 'email':
          valueA = a.email.toLowerCase();
          valueB = b.email.toLowerCase();
          break;
        case 'level':
          valueA = a.level.id;
          valueB = b.level.id;
          break;
        case 'wallet':
          valueA = a.wallet ? a.wallet.balance : 0;
          valueB = b.wallet ? b.wallet.balance : 0;
          break;
        case 'rating':
          valueA = a.rating !== null && a.rating !== undefined ? a.rating : -1;
          valueB = b.rating !== null && b.rating !== undefined ? b.rating : -1;
          break;
        case 'status':
          valueA = a.isBlocked || a.blocked ? 1 : 0;
          valueB = b.isBlocked || b.blocked ? 1 : 0;
          break;
        default:
          return 0;
      }

      if (valueA < valueB) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) {
      return 'bi-arrow-down-up';
    }
    return this.sortDirection === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedRegion = '';
    this.selectedLevel = '';
    this.selectedStatus = '';
    this.sortColumn = '';
    this.sortDirection = 'asc';
    this.applyFilters();
  }

  getLevelDisplay(level: Level | null): string {
    if (!level) return 'No Level';
    return `L${level.id}`;
  }

  getWalletBalance(user: AdminUser): string {
    return user.wallet ? `₹${user.wallet.balance}` : 'No Wallet';
  }

  getDefaultAddress(user: AdminUser): string {
    const defaultAddr = user.addresses.find(addr => addr.defaultAddress);
    if (defaultAddr) {
      return `${defaultAddr.city}, ${defaultAddr.state}`;
    }
    return user.addresses.length > 0 ? `${user.addresses[0].city}, ${user.addresses[0].state}` : 'No Address';
  }

  getBlockedStatus(user: AdminUser): string {
    return user.isBlocked || user.blocked ? 'Blocked' : 'Active';
  }

  getBlockedStatusClass(user: AdminUser): string {
    return user.isBlocked || user.blocked ? 'badge bg-danger' : 'badge bg-success';
  }

  refreshData(): void {
    this.clearFilters();
    this.fetchUsers();
  }

  editUser(user: AdminUser): void {
    console.log('Editing user:', user);
    // Add your edit logic here (e.g., navigate to edit form)
  }

  viewUserDetails(user: AdminUser): void {
    this.selectedUser = user;
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.selectedUser = null;
  }

  formatDate(dateString: string | null): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getBankAccountType(type: string): string {
    return type ? type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() : 'N/A';
  }

  toggleUserBlock(user: AdminUser): void {
    const isCurrentlyBlocked = user.isBlocked || user.blocked;
    const action = isCurrentlyBlocked ? 'unblock' : 'block';
    
    if (confirm(`Are you sure you want to ${action} this user?`)) {
      const apiCall = isCurrentlyBlocked 
        ? this.adminService.unblockUser(user.id)
        : this.adminService.blockUser(user.id);
      
      apiCall.subscribe({
        next: (response) => {
          if (response.status === 200) {
            // Update the user's blocked status in the local array
            const userIndex = this.users.findIndex(u => u.id === user.id);
            if (userIndex !== -1) {
              this.users[userIndex].isBlocked = response.data.isBlocked;
              this.users[userIndex].blocked = response.data.blocked;
            }
            
            // Update filtered users as well
            const filteredUserIndex = this.filteredUsers.findIndex(u => u.id === user.id);
            if (filteredUserIndex !== -1) {
              this.filteredUsers[filteredUserIndex].isBlocked = response.data.isBlocked;
              this.filteredUsers[filteredUserIndex].blocked = response.data.blocked;
            }
            
            console.log(`User ${action}ed successfully:`, response.message);
          }
        },
        error: (error) => {
          console.error(`Error ${action}ing user:`, error);
          alert(`Failed to ${action} user. Please try again.`);
        }
      });
    }
  }

  trackByUserId(index: number, user: AdminUser): number {
    return user.id;
  }
}
