
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Order, OrderResponse, OrderArrayResponse, OrderService } from '../../services/order.services';

@Component({
  selector: 'app-view-ongoingorders',
  standalone: false,
  templateUrl: './view-ongoingorders.component.html',
  styleUrl: './view-ongoingorders.component.css'
})
export class ViewOngoingordersComponent implements OnInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];
  loading = false;
  error: string | null = null;

  Math = Math;
  
  // Filters
  searchControl = new FormControl('');
  statusFilter = new FormControl('');
  orderTypeFilter = new FormControl('');
  selectedUserId: number | null = null;
  selectedUserType: 'buyer' | 'seller' | 'all' = 'all';
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  
  // Status options
  statusOptions = ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'CANCELLED'];
  orderTypeOptions = ['BUYER_REQUEST', 'SELLER_REQUEST'];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.loadOrders();
    this.setupFilters();
  }

  setupFilters(): void {
    // Search filter
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => this.loadOrders());

    // Status filter
    this.statusFilter.valueChanges.subscribe(() => this.applyFilters());
    
    // Order type filter
    this.orderTypeFilter.valueChanges.subscribe(() => this.applyFilters());
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;
    const searchTerm = this.searchControl.value || '';

    if (this.selectedUserType === 'buyer' && this.selectedUserId) {
      this.orderService.getBuyerOrders(this.selectedUserId, searchTerm).subscribe({
        next: (response) => this.handleOrderResponse(response),
        error: (error) => this.handleError(error)
      });
    } else if (this.selectedUserType === 'seller' && this.selectedUserId) {
      this.orderService.getSellerOrders(this.selectedUserId, searchTerm).subscribe({
        next: (response) => this.handleOrderResponse(response),
        error: (error) => this.handleError(error)
      });
    } else {
      // Load all orders
      this.orderService.getAllOrders(searchTerm).subscribe({
        next: (response) => this.handleOrderResponse(response),
        error: (error) => this.handleError(error)
      });
    }
  }

  handleOrderResponse(response: OrderResponse | OrderArrayResponse): void {
    if (Array.isArray(response)) {
      // Handle array response
      this.orders = response;
      this.applyFilters();
    } else if (response.status === 200) {
      // Handle object response with status
      this.orders = response.data;
      this.applyFilters();
    } else {
      this.error = 'Failed to load orders';
    }
    this.loading = false;
  }

  handleError(error: any): void {
    this.error = 'Error loading orders: ' + (error.message || 'Unknown error');
    this.loading = false;
  }

  applyFilters(): void {
    let filtered = [...this.orders];
    
    // Search filter
    const searchTerm = this.searchControl.value?.toLowerCase() || '';
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.buyer.name.toLowerCase().includes(searchTerm) ||
        order.seller.name.toLowerCase().includes(searchTerm) ||
        order.product.name.toLowerCase().includes(searchTerm) ||
        order.id.toString().includes(searchTerm)
      );
    }
    
    // Status filter
    const statusFilter = this.statusFilter.value;
    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Order type filter
    const orderTypeFilter = this.orderTypeFilter.value;
    if (orderTypeFilter) {
      filtered = filtered.filter(order => order.orderType === orderTypeFilter);
    }
    
    this.filteredOrders = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1;
  }

  onUserSearch(userId: number, userType: 'buyer' | 'seller'): void {
    this.selectedUserId = userId;
    this.selectedUserType = userType;
    this.loadOrders();
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.statusFilter.setValue('');
    this.orderTypeFilter.setValue('');
    this.selectedUserId = null;
    this.selectedUserType = 'all';
    this.loadOrders();
  }

  getStatusBadgeClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'PENDING': 'badge-warning',
      'ACCEPTED': 'badge-success',
      'REJECTED': 'badge-danger',
      'COMPLETED': 'badge-primary',
      'CANCELLED': 'badge-secondary'
    };
    return statusClasses[status] || 'badge-secondary';
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  getPaginatedOrders(): Order[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredOrders.slice(startIndex, endIndex);
  }

  getTotalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.getTotalPages()) {
      this.currentPage = page;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }
}
