import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { SellerService } from '../../services/seller.service';
import { Level } from '../../models/level.model';
import { SellerProduct } from '../../models/sellerProduct.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-sellers',
  standalone: false,
  templateUrl: './view-sellers.component.html',
  styleUrl: './view-sellers.component.css'
})
export class ViewSellersComponent {
  users: User[] = [];
  loading = true;
  error = '';
  sellerProducts: SellerProduct[] = [];
  selectedSeller: User | null = null;

  constructor(private sellerService: SellerService, private router: Router) {}

  ngOnInit(): void {
    this.fetchSellers();
  }

  fetchSellers(): void {
    this.loading = true;
    this.sellerService.getAllSellers()
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
    this.fetchSellers();
  }

  editUser(user: User): void {
    console.log('Editing user:', user);
    // Add your edit logic here (e.g., navigate to edit form)
  }

  // Fetch and display products when "View" button is clicked
  viewProducts(sellerId: number): void {
    this.router.navigate(['/seller-products', sellerId]);
  }
}

