import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.services';

@Component({
  selector: 'app-view-products',
  standalone: false,
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css']
})

export class ViewProductComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  loading: boolean = true;
  
  // Filter properties
  searchTerm: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  minQuantity: number | null = null;
  maxQuantity: number | null = null;
  
  // Modal properties
  showModal: boolean = false;
  selectedProduct: any = null;
  modalLoading: boolean = false;

  constructor(private productService: ProductService, private router: Router) {}
  
  ngOnInit() {
    this.productService.getAllProducts().subscribe({
      next: (res) => {
        this.products = res; // API directly returns an array
        this.filteredProducts = [...res]; // Initialize filtered products
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

  // View product details in modal
  viewProduct(productId: number) {
    this.modalLoading = true;
    this.showModal = true;
    this.selectedProduct = null;
    
    this.productService.getProductById(productId).subscribe({
      next: (product) => {
        this.selectedProduct = product;
        this.modalLoading = false;
      },
      error: (err) => {
        console.error('Error fetching product details:', err);
        this.modalLoading = false;
        this.closeModal();
      }
    });
  }

  // Close modal
  closeModal() {
    this.showModal = false;
    this.selectedProduct = null;
    this.modalLoading = false;
  }

  // Apply filters to products
  applyFilters() {
    this.filteredProducts = this.products.filter(product => {
      // Search by name filter
      const matchesName = !this.searchTerm || 
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Price range filter - check all level prices
      let matchesPrice = true;
      if (this.minPrice !== null || this.maxPrice !== null) {
        matchesPrice = false;
        if (product.levelPrices && product.levelPrices.length > 0) {
          for (let level of product.levelPrices) {
            const minPriceMatch = this.minPrice === null || level.minPrice >= this.minPrice;
            const maxPriceMatch = this.maxPrice === null || level.maxPrice <= this.maxPrice;
            if (minPriceMatch && maxPriceMatch) {
              matchesPrice = true;
              break;
            }
          }
        }
      }
      
      // Quantity range filter - check all level quantities
      let matchesQuantity = true;
      if (this.minQuantity !== null || this.maxQuantity !== null) {
        matchesQuantity = false;
        if (product.levelPrices && product.levelPrices.length > 0) {
          for (let level of product.levelPrices) {
            const minQtyMatch = this.minQuantity === null || level.minQuantity >= this.minQuantity;
            const maxQtyMatch = this.maxQuantity === null || level.maxQuantity <= this.maxQuantity;
            if (minQtyMatch && maxQtyMatch) {
              matchesQuantity = true;
              break;
            }
          }
        }
      }
      
      return matchesName && matchesPrice && matchesQuantity;
    });
  }

  // Clear all filters
  clearFilters() {
    this.searchTerm = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.minQuantity = null;
    this.maxQuantity = null;
    this.filteredProducts = [...this.products];
  }

}
