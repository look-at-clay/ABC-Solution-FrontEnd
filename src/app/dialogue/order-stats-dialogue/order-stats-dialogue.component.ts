import { Component, Inject } from '@angular/core';
import { OrderStatistics } from '../../models/order-stat.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-order-stats-dialogue',
  standalone: false,
  templateUrl: './order-stats-dialogue.component.html',
  styleUrl: './order-stats-dialogue.component.css'
})
export class OrderStatsDialogueComponent {

  constructor(
    public dialogRef: MatDialogRef<OrderStatsDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderStatistics
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  getPercentage(count: number): number {
    return this.data.totalOrders > 0 ? (count / this.data.totalOrders) * 100 : 0;
  }

  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'PLACED': 'bg-primary',
      'ACCEPTED': 'bg-success',
      'CONFIRMED': 'bg-info',
      'INTRANSIT': 'bg-warning',
      'DELIVERED': 'bg-success',
      'SUCCESFULL': 'bg-success',
      'PENDING': 'bg-secondary',
      'REJECTED': 'bg-danger',
      'REFUNDED': 'bg-warning',
      'CANCELLED': 'bg-dark'
    };
    return statusColors[status] || 'bg-secondary';
  }

  getStatusIcon(status: string): string {
    const statusIcons: { [key: string]: string } = {
      'PLACED': 'bi-cart-plus',
      'ACCEPTED': 'bi-check-circle',
      'CONFIRMED': 'bi-check2-circle',
      'INTRANSIT': 'bi-truck',
      'DELIVERED': 'bi-box-seam',
      'SUCCESFULL': 'bi-check-circle-fill',
      'PENDING': 'bi-clock',
      'REJECTED': 'bi-x-circle',
      'REFUNDED': 'bi-arrow-counterclockwise',
      'CANCELLED': 'bi-x-circle-fill'
    };
    return statusIcons[status] || 'bi-question-circle';
  }

  formatStatusName(status: string): string {
    return status.toLowerCase().replace(/^\w/, c => c.toUpperCase());
  }

  // Add these helper methods to move calculations from template
  getStatusCount(status: string): number {
    const statusData = this.data.statusCounts.find(s => s.status === status);
    return statusData ? statusData.count : 0;
  }

  getActiveOrdersCount(): number {
    const placedCount = this.getStatusCount('PLACED');
    const acceptedCount = this.getStatusCount('ACCEPTED');
    return placedCount + acceptedCount;
  }

  getCompletedOrdersCount(): number {
    const deliveredCount = this.getStatusCount('DELIVERED');
    const successfulCount = this.getStatusCount('SUCCESFULL');
    return deliveredCount + successfulCount;
  }

  getIssueOrdersCount(): number {
    const rejectedCount = this.getStatusCount('REJECTED');
    const cancelledCount = this.getStatusCount('CANCELLED');
    return rejectedCount + cancelledCount;
  }

  // Helper method to get visible status counts (count > 0)
  getVisibleStatusCounts() {
    return this.data.statusCounts.filter(statusCount => statusCount.count > 0);
  }
}
