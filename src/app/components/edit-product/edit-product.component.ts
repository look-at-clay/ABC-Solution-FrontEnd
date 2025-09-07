import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.services';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LevelService } from '../../services/level.services';
import { CategoryService, Category } from '../../services/category.services';

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
  categories: Category[] = [];
  imageUrls: string[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private levelService: LevelService,
    private categoryService: CategoryService
  ) {
    this.productForm = this.createProductForm();
    this.productId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadProductDetails();
  }

  createProductForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      categoryId: [null, [Validators.required]],
      gstPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      unit: ['', [Validators.required]],
      expiryInDays: [null, [Validators.min(1)]],
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
      maxQuantity: [levelPrice?.maxQuantity || 1, [Validators.required, Validators.min(1)]],
      platformFeeBuyer: [levelPrice?.platformFeeBuyer || 0, [Validators.required, Validators.min(0)]],
      platformFeeSeller: [levelPrice?.platformFeeSeller || 0, [Validators.required, Validators.min(0)]],
      payPlatformFeeAtCompletionBuyer: [levelPrice?.payPlatformFeeAtCompletionBuyer || false],
      payPlatformFeeAtCompletionSeller: [levelPrice?.payPlatformFeeAtCompletionSeller || false],
      platformFeeType: [levelPrice?.platformFeeType || null],
      gstPercentage: [levelPrice?.gstPercentage || 0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe(
      (categories) => {
        this.categories = categories;
      },
      (error) => {
        console.error('Error loading categories:', error);
      }
    );
  }

  loadProductDetails(): void {
    this.isLoading = true;
    this.productService.getProductById(this.productId).subscribe(
      (product) => {
        // Store image URLs
        this.imageUrls = product.imageUrls || [];
        
        // Patch basic product info
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          categoryId: product.category?.id || null,
          gstPercentage: product.gstPercentage || 0,
          unit: product.unit || '',
          expiryInDays: product.expiryInDays
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
    // Get currently used level IDs
    const usedLevelIds = this.levelPricesFormArray.controls.map(
      control => control.get('level')?.get('id')?.value
    );
    
    // Fetch all available levels from API
    this.levelService.getAllLevels().subscribe({
      next: (levels) => {
        // Find the first available level that hasn't been used
        const availableLevel = levels.find(level => !usedLevelIds.includes(level.id));
        
        if (availableLevel) {
          const formGroup = this.createLevelPriceFormGroup(availableLevel.id, `L${availableLevel.name}`);
          this.levelPricesFormArray.push(formGroup);
          this.loadLevelAliases(availableLevel.id);
        } else {
          // All available levels are already added
          const levelNames = levels.map(level => `L${level.name}`).join(', ');
          alert(`All available price levels (${levelNames}) are already added.`);
        }
      },
      error: (error) => {
        console.error('Error fetching levels:', error);
        alert('Error loading available levels. Please try again.');
      }
    });
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
      categoryId: formValue.categoryId,
      gstPercentage: formValue.gstPercentage,
      unit: formValue.unit,
      expiryInDays: formValue.expiryInDays,
      imageUrls: this.imageUrls,
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