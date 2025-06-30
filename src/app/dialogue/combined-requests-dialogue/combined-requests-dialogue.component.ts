import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CombinedRequestStats, BuyerStats, SellerStats, RequestStatusCount } from '../../models/request-stats.model';

@Component({
  selector: 'app-combined-requests-dialogue',
  standalone: false,
  templateUrl: './combined-requests-dialogue.component.html',
  styleUrls: ['./combined-requests-dialogue.component.css']
})
export class CombinedRequestsDialogueComponent {
  
  constructor(
    public dialogRef: MatDialogRef<CombinedRequestsDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CombinedRequestStats
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  getPercentage(count: number, total: number): number {
    return total > 0 ? (count / total) * 100 : 0;
  }

  getStatusColor(status: string): string {
    const statusColors: { [key: string]: string } = {
      'PENDING': 'bg-warning',
      'ACCEPTED': 'bg-success',
      'REJECTED': 'bg-danger',
      'COMPLETED': 'bg-info'
    };
    return statusColors[status] || 'bg-secondary';
  }

  getStatusIcon(status: string): string {
    const statusIcons: { [key: string]: string } = {
      'PENDING': 'bi-hourglass',
      'ACCEPTED': 'bi-check-circle',
      'REJECTED': 'bi-x-circle',
      'COMPLETED': 'bi-check-all'
    };
    return statusIcons[status] || 'bi-question-circle';
  }

  formatStatusName(status: string): string {
    return status.toLowerCase().replace(/^\w/, c => c.toUpperCase());
  }
}
