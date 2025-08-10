import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.services';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LevelService } from '../../services/level.services';

@Component({
  selector: 'app-edit-product',
  standalone: false,
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css']
})
export class EditProductComponent implements OnInit {
[x: string]: any;
  productForm: FormGroup;
  productId: number;
  isLoading = false;
  submitError = '';
  levelAliases: { [key: number]: any[] } = {}; // Store level aliases by level ID

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private levelService: LevelService
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

  createLevelPriceFormGroup(levelId: number, levelName: any, levelPrice?: any): FormGroup {
    return this.fb.group({
      id: [levelPrice?.id || null],
      level: this.fb.group({
        id: [levelId, Validators.required],
        name: [levelName]
      }),
      aliasId: [levelPrice?.aliasId || null],
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
            const levelName = levelPrice.level?.name || levelPrice.name;
            
            // Create form group for this level price
            const formGroup = this.createLevelPriceFormGroup(levelId, levelName, levelPrice);
            this.levelPricesFormArray.push(formGroup);
            
            // Load aliases for this level
            this.loadLevelAliases(levelId);
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

  loadLevelAliases(levelId: number): void {
    // Only load if we haven't already loaded for this level
    if (!this.levelAliases[levelId]) {
      this.levelService.getLevelAliases(levelId).subscribe(
        (aliases) => {
          this.levelAliases[levelId] = aliases;
        },
        (error) => {
          console.error(`Error loading aliases for level ${levelId}:`, error);
        }
      );
    }
  }

  addLevelPrice(): void {
    // Find the next available level ID (1, 2, or 3)
    const usedLevelIds = this.levelPricesFormArray.controls.map(
      control => control.get('level')?.get('id')?.value
    );
    
    for (let i = 1; i <= 3; i++) {
      if (!usedLevelIds.includes(i)) {
        const formGroup = this.createLevelPriceFormGroup(i, `L${i}`);
        this.levelPricesFormArray.push(formGroup);
        this.loadLevelAliases(i);
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
    
    // Use the name property if available, otherwise fallback to L{id}
    const levelName = levelControl.get('name')?.value;
    if (levelName) return levelName.toString();
    
    const levelId = levelControl.get('id')?.value;
    return `L${levelId}`;
  }

  getLevelId(levelControl: AbstractControl | null): number {
    if (!levelControl || !(levelControl instanceof FormGroup)) return 0;
    return levelControl.get('id')?.value || 0;
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }
}