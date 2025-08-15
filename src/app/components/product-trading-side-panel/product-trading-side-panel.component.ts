import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { AdminService } from '../../services/admin.services';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-product-trading-side-panel',
  standalone: false,
  templateUrl: './product-trading-side-panel.component.html',
  styleUrls: ['./product-trading-side-panel.component.css']
})
export class ProductTradingSidePanelComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() selectedProduct: any = null;
  @Output() closePanel = new EventEmitter<void>();

  loading = false;
  error = '';
  totalAmount = 0;
  totalVolume = 0;
  amountMessage = '';
  volumeMessage = '';

  constructor(private adminService: AdminService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedProduct'] && this.selectedProduct && this.isOpen) {
      this.fetchTradingStatistics();
    }
  }

  fetchTradingStatistics(): void {
    if (!this.selectedProduct || !this.selectedProduct.id) {
      return;
    }

    this.loading = true;
    this.error = '';

    // Fetch both total amount and total volume simultaneously
    forkJoin({
      amount: this.adminService.getProductTotalAmount(this.selectedProduct.id),
      volume: this.adminService.getProductTotalVolume(this.selectedProduct.id)
    }).subscribe({
      next: (results) => {
        this.totalAmount = results.amount.totalAmount || 0;
        this.totalVolume = results.volume.totalAmount || 0; // Note: API returns totalAmount for volume too
        this.amountMessage = results.amount.message || '';
        this.volumeMessage = results.volume.message || '';
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load trading statistics';
        this.loading = false;
        console.error('Error fetching trading statistics:', error);
      }
    });
  }

  onClose(): void {
    this.closePanel.emit();
  }

  refreshData(): void {
    this.fetchTradingStatistics();
  }
}