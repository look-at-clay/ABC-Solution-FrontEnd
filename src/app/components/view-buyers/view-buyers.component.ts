import { Component } from '@angular/core';
import { User } from '../../models/user.model';
import { BuyerProduct } from '../../models/buyerProduct.model';
import { BuyerService } from '../../services/buyer.service';
import { Router } from '@angular/router';
import { Level } from '../../models/level.model';

@Component({
  selector: 'app-view-buyers',
  standalone: false,
  templateUrl: './view-buyers.component.html',
  styleUrl: './view-buyers.component.css'
})
export class ViewBuyersComponent {

  users: User[] = [];
    loading = true;
    error = '';
    buyerProducts: BuyerProduct[] = [];
    selectedSeller: User | null = null;
  
    constructor(private buyerService: BuyerService, private router: Router) {}
  
    ngOnInit(): void {
      this.fetchBuyers();
    }

  fetchBuyers(): void {
      this.loading = true;
      this.buyerService.getAllBuyers()
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
        this.fetchBuyers();
      }
    
      editUser(user: User): void {
        console.log('Editing user:', user);
        // Add your edit logic here (e.g., navigate to edit form)
      }
    
      // Fetch and display products when "View" button is clicked
      viewProducts(buyerId: number): void {
        this.router.navigate(['/buyer-products', buyerId]);
      }

}
