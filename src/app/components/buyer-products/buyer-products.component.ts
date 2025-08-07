import { Component } from '@angular/core';
import { BuyerProduct } from '../../models/buyerProduct.model';
import { ActivatedRoute } from '@angular/router';
import { BuyerService } from '../../services/buyer.service';

@Component({
  selector: 'app-buyer-products',
  standalone: false,
  templateUrl: './buyer-products.component.html',
  styleUrls: ['./buyer-products.component.css']
})
export class BuyerProductsComponent {
  buyerProducts: BuyerProduct[] = [];
    loading = false;
    error: string | null = null;
    buyerId!: number;
    buyerName!: string;
  
    constructor(private route: ActivatedRoute, private buyerService: BuyerService) {}
  
    ngOnInit(): void {
      this.buyerId = Number(this.route.snapshot.paramMap.get('buyerId'));
      this.buyerName = String(this.route.snapshot.paramMap.get('userName'));
      this.fetchProducts();
    }
  
    fetchProducts(): void {
      this.loading = true;
      this.buyerService.getBuyerProducts(this.buyerId).subscribe({
        next: (data) => {
          this.buyerProducts = data;
          this.loading = false;
        },
        error: () => {
          this.error = 'Error fetching products';
          this.loading = false;
        }
      });
    }
}
