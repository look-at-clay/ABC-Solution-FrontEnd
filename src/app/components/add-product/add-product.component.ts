import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.services';
import { LevelService } from '../../services/level.services';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-add-product',
  standalone: false,
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  levels: any[] = []; // Store actual level objects
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder, 
    private productService: ProductService,
    private levelService: LevelService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.fetchLevels();
  }

  initializeForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      createdByAdmin: this.fb.group({
        id: [4, Validators.required]
      }),
      levelPrices: this.fb.array([])
    });
  }

  fetchLevels(): void {
    this.isLoading = true;
    this.levelService.getAllLevels().pipe(
      tap(levels => {
        this.levels = levels;
        this.createLevelPriceControls();
        this.isLoading = false;
      }),
      catchError(error => {
        console.error('Error fetching levels:', error);
        this.errorMessage = 'Could not fetch levels. Using default.';
        this.isLoading = false;
        return of(null);
      })
    ).subscribe();
  }

  createLevelPriceControls(): void {
    // Clear existing level prices
    const levelPricesArray = this.productForm.get('levelPrices') as FormArray;
    levelPricesArray.clear();

    // Create level price controls based on actual levels from the database
    if (this.levels.length > 0) {
      this.levels.forEach(level => {
        levelPricesArray.push(this.createLevelPrice(level));
      });
    } else {
      // Fallback if no levels are found
      for (let i = 1; i <= 3; i++) {
        levelPricesArray.push(this.createDefaultLevelPrice(i));
      }
    }
  }

  createLevelPrice(level: any): FormGroup {
    return this.fb.group({
      level: this.fb.group({ 
        id: [level.id, Validators.required] 
      }),
      minPrice: [0, [Validators.required, Validators.min(0)]],
      maxPrice: [0, [Validators.required, Validators.min(0)]],
      minQuantity: [0, [Validators.required, Validators.min(0)]],
      maxQuantity: [0, [Validators.required, Validators.min(0)]]
    }, { validators: this.priceQuantityValidator });
  }

  // Fallback method for creating default level prices
  createDefaultLevelPrice(levelId: number): FormGroup {
    return this.fb.group({
      level: this.fb.group({ 
        id: [levelId, Validators.required] 
      }),
      minPrice: [0, [Validators.required, Validators.min(0)]],
      maxPrice: [0, [Validators.required, Validators.min(0)]],
      minQuantity: [0, [Validators.required, Validators.min(0)]],
      maxQuantity: [0, [Validators.required, Validators.min(0)]]
    }, { validators: this.priceQuantityValidator });
  }

  // Custom validator to ensure max is greater than min
  priceQuantityValidator(group: FormGroup): {[key: string]: any} | null {
    const minPrice = group.get('minPrice')?.value;
    const maxPrice = group.get('maxPrice')?.value;
    const minQuantity = group.get('minQuantity')?.value;
    const maxQuantity = group.get('maxQuantity')?.value;

    if (minPrice > maxPrice || minQuantity > maxQuantity) {
      return { 'invalidRange': true };
    }
    return null;
  }

  get levelPrices(): FormArray {
    return this.productForm.get('levelPrices') as FormArray;
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.productService.addProduct(this.productForm.value).subscribe({
        next: () => {
          alert('Product added successfully!');
          this.productForm.reset();
          this.fetchLevels(); // Recreate level prices after reset
        },
        error: (err) => {
          alert('Error adding product.');
          console.error(err);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.markFormGroupTouched(this.productForm);
    }
  }

  // Helper method to mark all controls as touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}