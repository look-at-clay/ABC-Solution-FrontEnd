import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../services/product.services';

@Component({
  selector: 'app-view-products',
  standalone: false,
  templateUrl: './view-products.component.html',
  styleUrl: './view-products.component.css'
})

export class ViewProductComponent implements OnInit {
  products: any[] = [];
  loading: boolean = true;

  constructor(private productService: ProductService, private router: Router) {}
  
  ngOnInit() {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res; // API directly returns an array
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching products:', err);
        this.loading = false;
      }
    });
  }

  // Helper function to get min and max values for a given level
  getPriceLevel(product: any, levelId: number, type: 'price' | 'quantity') {
    const level = product.levelPrices.find((lp: any) => lp.levelId === levelId);
    if (!level) return 'N/A';

    if (type === 'price') {
      return `${level.minPrice} - ${level.maxPrice}`;
    } else {
      return `${level.minQuantity} - ${level.maxQuantity}`;
    }
  }
  // Navigate to the edit page
  editProduct(product: any) {
    this.router.navigate(['/edit-product', product.id]); 
  }

}
