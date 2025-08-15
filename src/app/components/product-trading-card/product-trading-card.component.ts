import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ProductService } from '../../services/product.services';

@Component({
  selector: 'app-product-trading-card',
  standalone: false,
  templateUrl: './product-trading-card.component.html',
  styleUrls: ['./product-trading-card.component.css']
})
export class ProductTradingCardComponent implements OnInit {
  products: any[] = [];
  loading = true;
  error = '';
  selectedProductId = '';
  
  @Output() productSelected = new EventEmitter<any>();

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.loading = true;
    this.productService.getAllProducts().subscribe({
      next: (products: any[]) => {
        this.products = products;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load products';
        this.loading = false;
        console.error('Error fetching products:', error);
      }
    });
  }

  onProductSelect(event: any): void {
    const productId = event.target.value;
    if (productId) {
      this.productSelected.emit(productId);
    }
  }

  refreshProducts(): void {
    this.fetchProducts();
  }
}