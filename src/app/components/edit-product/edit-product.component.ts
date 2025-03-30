import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.services';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LevelService } from '../../services/level.services';

@Component({
  selector: 'app-edit-product',
  standalone: false,
  templateUrl: './edit-product.component.html',
  styleUrl: './edit-product.component.css'
})
export class EditProductComponent implements OnInit {
  productForm: FormGroup;
  productId: number;
  isLoading = false;
  submitError = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.createProductForm();
    this.productId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadProductDetails();
  }

  createProductForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      levelPrices: this.fb.array([])
    });
  }

  get levelPricesFormArray(): FormArray {
    return this.productForm.get('levelPrices') as FormArray;
  }

  createLevelPriceFormGroup(levelId: number, levelPrice?: any): FormGroup {
    return this.fb.group({
      id: [levelPrice?.id || null],
      level: this.fb.group({
        id: [levelId, Validators.required]
      }),
      minPrice: [levelPrice?.minPrice || 0, [Validators.required, Validators.min(0)]],
      maxPrice: [levelPrice?.maxPrice || 0, [Validators.required, Validators.min(0)]],
      minQuantity: [levelPrice?.minQuantity || 1, [Validators.required, Validators.min(1)]],
      maxQuantity: [levelPrice?.maxQuantity || 1, [Validators.required, Validators.min(1)]]
    });
  }

  loadProductDetails(): void {
    this.isLoading = true;
    this.productService.getProductById(this.productId).subscribe(
      (product) => {
        // Patch basic product info
        this.productForm.patchValue({
          name: product.name,
          description: product.description
        });

        // Clear existing level prices
        this.levelPricesFormArray.clear();
        
        // Add level prices from API response
        if (product.levelPrices && product.levelPrices.length > 0) {
          product.levelPrices.forEach((levelPrice: any) => {
            // Handle both formats - one with level.id and one with levelId
            const levelId = levelPrice.level?.id || levelPrice.levelId;
            this.levelPricesFormArray.push(
              this.createLevelPriceFormGroup(levelId, levelPrice)
            );
          });
        }
        
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading product:', error);
        this.isLoading = false;
      }
    );
  }

  addLevelPrice(): void {
    // Find the next available level ID (1, 2, or 3)
    const usedLevelIds = this.levelPricesFormArray.controls.map(
      control => control.get('level')?.get('id')?.value
    );
    
    for (let i = 1; i <= 3; i++) {
      if (!usedLevelIds.includes(i)) {
        this.levelPricesFormArray.push(this.createLevelPriceFormGroup(i));
        return;
      }
    }
    
    // All levels are used
    alert('All price levels (L1, L2, L3) are already added.');
  }

  removeLevelPrice(index: number): void {
    this.levelPricesFormArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.markFormGroupTouched(this.productForm);
      return;
    }

    this.isLoading = true;
    this.submitError = '';
    
    const formValue = this.productForm.value;
    
    // Create the payload in the format expected by the API
    const updatedProduct = {
      name: formValue.name,
      description: formValue.description,
      levelPrices: formValue.levelPrices
    };

    this.productService.updateProduct(this.productId, updatedProduct).subscribe(
      (response) => {
        this.isLoading = false;
        this.router.navigate(['/products']);
      },
      (error) => {
        this.isLoading = false;
        this.submitError = 'Failed to update product. Please try again.';
        console.error('Error updating product:', error);
      }
    );
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else if (control instanceof FormArray) {
        for (const group of control.controls) {
          if (group instanceof FormGroup) {
            this.markFormGroupTouched(group);
          }
        }
      }
    });
  }

  isFieldInvalid(form: FormGroup, field: string): boolean {
    const control = form.get(field);
    return control ? (control.invalid && (control.dirty || control.touched)) : false;
  }

  getLevelText(levelControl: AbstractControl | null): string {
    if (!levelControl || !(levelControl instanceof FormGroup)) return '';
    
    const levelId = levelControl.get('id')?.value;
    return `L${levelId}`;
  }
}