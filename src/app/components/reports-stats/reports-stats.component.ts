import { Component, OnInit } from '@angular/core';
import { ProductTradingData, ReportsStatsResponse } from '../../models/reports-stats.model';
import { ReportsStatsService } from '../../services/reports-stats.service';

@Component({
  selector: 'app-reports-stats',
  standalone: false,
  templateUrl: './reports-stats.component.html',
  styleUrls: ['./reports-stats.component.css']
})
export class ReportsStatsComponent implements OnInit {
  loading = false;
  error: string | null = null;
  statsData: ReportsStatsResponse | null = null;
  fromDate: string = '';
  toDate: string = '';

  constructor(private reportsStatsService: ReportsStatsService) {}

  ngOnInit(): void {
    // Set default date range (last 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    this.toDate = this.formatDateForInput(today);
    this.fromDate = this.formatDateForInput(thirtyDaysAgo);
    
    this.loadStats();
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().slice(0, 16);
  }

  private formatDateForAPI(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 19);
  }

  loadStats(): void {
    if (!this.fromDate || !this.toDate) {
      this.error = 'Please select both from and to dates';
      return;
    }

    this.loading = true;
    this.error = null;

    const formattedFromDate = this.formatDateForAPI(this.fromDate);
    const formattedToDate = this.formatDateForAPI(this.toDate);

    this.reportsStatsService.getProductTradingStats(formattedFromDate, formattedToDate)
      .subscribe({
        next: (data) => {
          this.statsData = data;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error fetching stats:', err);
          this.error = 'Failed to load statistics. Please try again.';
          this.loading = false;
        }
      });
  }

  onDateChange(): void {
    if (this.fromDate && this.toDate) {
      this.loadStats();
    }
  }

  getTotalVolumeTraded(): number {
    if (!this.statsData?.productTradingData) return 0;
    return this.statsData.productTradingData.reduce((total, product) => total + product.totalVolumeTraded, 0);
  }

  getTotalAmountTraded(): number {
    if (!this.statsData?.productTradingData) return 0;
    return this.statsData.productTradingData.reduce((total, product) => total + product.totalAmountTraded, 0);
  }

  getTopProductByVolume(): ProductTradingData | null {
    if (!this.statsData?.productTradingData || this.statsData.productTradingData.length === 0) return null;
    return this.statsData.productTradingData.reduce((max, product) => 
      product.totalVolumeTraded > max.totalVolumeTraded ? product : max
    );
  }

  getTopProductByAmount(): ProductTradingData | null {
    if (!this.statsData?.productTradingData || this.statsData.productTradingData.length === 0) return null;
    return this.statsData.productTradingData.reduce((max, product) => 
      product.totalAmountTraded > max.totalAmountTraded ? product : max
    );
  }
}