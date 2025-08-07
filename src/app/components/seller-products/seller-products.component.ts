import { Component } from '@angular/core';
import { SellerProduct } from '../../models/sellerProduct.model';
import { ActivatedRoute } from '@angular/router';
import { SellerService } from '../../services/seller.service';

@Component({
  selector: 'app-seller-products',
  standalone: false,
  templateUrl: './seller-products.component.html',
  styleUrls: ['./seller-products.component.css']
})
export class SellerProductsComponent {
  sellerProducts: SellerProduct[] = [];
  loading = false;
  error: string | null = null;
  sellerId!: number;

  constructor(private route: ActivatedRoute, private sellerService: SellerService) {}

  ngOnInit(): void {
    this.sellerId = Number(this.route.snapshot.paramMap.get('sellerId'));
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.loading = true;
    this.sellerService.getSellerProducts(this.sellerId).subscribe({
      next: (data) => {
        this.sellerProducts = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error fetching products';
        this.loading = false;
      }
    });
  }
}
