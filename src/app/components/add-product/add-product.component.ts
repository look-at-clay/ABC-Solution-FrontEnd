import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.services';
import { LevelService } from '../../services/level.services';
import { CategoryService } from '../../services/category.services';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-add-product',
  standalone: false,
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  levels: any[] = [];
  categories: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  selectedFiles: File[] = [];
  imageError: string = '';

  constructor(
    private fb: FormBuilder, 
    private productService: ProductService,
    private levelService: LevelService,
    private categoryService: CategoryService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.fetchLevels();
    this.fetchCategories();
  }

  initializeForm(): void {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      unit: ['', Validators.required],
      expiryInDays: [0, [Validators.required, Validators.min(1)]],
      gstPercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      category: this.fb.group({
        id: [null, Validators.required]
      }),
      levelPrices: this.fb.array([])
    });
  }

  // Add file selection handler with validation
  onFileSelected(event: any): void {
    const files = event.target.files;
    this.imageError = '';
    
    if (files.length < 1) {
      this.imageError = 'At least 1 image is required';
      this.selectedFiles = [];
      return;
    }
    
    if (files.length > 4) {
      this.imageError = 'Maximum 4 images allowed';
      this.selectedFiles = [];
      return;
    }
    
    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const invalidFiles = Array.from(files).filter((file: any) => !allowedTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      this.imageError = 'Only JPEG, JPG, PNG, and GIF files are allowed';
      this.selectedFiles = [];
      return;
    }
    
    // Validate file sizes (max 5MB per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = Array.from(files).filter((file: any) => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      this.imageError = 'Each image must be less than 5MB';
      this.selectedFiles = [];
      return;
    }
    
    this.selectedFiles = Array.from(files);
  }

  fetchLevels(): void {
    this.isLoading = true;
    this.levelService.getAllLevels().pipe(
      tap(levels => {
        if (levels && Array.isArray(levels) && levels.length > 0) {
          this.levels = levels;
        } else {
          // If no levels returned, use default levels
          this.levels = [
            { id: 1, name: 1 },
            { id: 2, name: 2 },
            { id: 3, name: 3 },
            { id: 4, name: 4 }
          ];
          this.errorMessage = 'No levels found. Using default levels.';
        }
        this.createLevelPriceControls();
        this.isLoading = false;
      }),
      catchError(error => {
        console.error('Error fetching levels:', error);
        this.errorMessage = 'Could not fetch levels. Using default levels.';
        this.levels = [
          { id: 1, name: 1 },
          { id: 2, name: 2 },
          { id: 3, name: 3 },
          { id: 4, name: 4 }
        ];
        this.createLevelPriceControls();
        this.isLoading = false;
        return of(null);
      })
    ).subscribe();
  }

  fetchCategories(): void {
    this.categoryService.getAllCategories().pipe(
      tap(categories => {
        this.categories = categories || [];
      }),
      catchError(error => {
        console.error('Error fetching categories:', error);
        this.categories = [];
        return of(null);
      })
    ).subscribe();
  }

  createLevelPriceControls(): void {
    const levelPricesArray = this.productForm.get('levelPrices') as FormArray;
    levelPricesArray.clear();

    if (this.levels.length > 0) {
      this.levels.forEach(level => {
        levelPricesArray.push(this.createLevelPrice(level));
      });
    } else {
      for (let i = 1; i <= 4; i++) {
        levelPricesArray.push(this.createDefaultLevelPrice(i));
      }
    }
  }

  createLevelPrice(level: any): FormGroup {
    return this.fb.group({
      level: this.fb.group({ 
        name: [level.name, Validators.required] 
      }),
      minPrice: [1, [Validators.required, Validators.min(0)]],
      maxPrice: [1, [Validators.required, Validators.min(0)]],
      minQuantity: [1, [Validators.required, Validators.min(0)]],
      maxQuantity: [1, [Validators.required, Validators.min(0)]],
      platformFeeBuyer: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      platformFeeSeller: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      platformFeeType: ['PERCENTAGE', Validators.required],
      gstPercentage: [18, [Validators.required, Validators.min(0), Validators.max(100)]]
    }, { validators: this.priceQuantityValidator });
  }

  createDefaultLevelPrice(levelName: number): FormGroup {
    return this.fb.group({
      level: this.fb.group({ 
        name: [levelName, Validators.required] 
      }),
      minPrice: [1, [Validators.required, Validators.min(0)]],
      maxPrice: [1, [Validators.required, Validators.min(0)]],
      minQuantity: [1, [Validators.required, Validators.min(0)]],
      maxQuantity: [1, [Validators.required, Validators.min(0)]],
      platformFeeBuyer: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      platformFeeSeller: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
      platformFeeType: ['PERCENTAGE', Validators.required],
      gstPercentage: [18, [Validators.required, Validators.min(0), Validators.max(100)]]
    }, { validators: this.priceQuantityValidator });
  }

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
    // Validate images
    if (this.selectedFiles.length < 1) {
      this.imageError = 'At least 1 image is required';
      return;
    }
    
    if (this.selectedFiles.length > 4) {
      this.imageError = 'Maximum 4 images allowed';
      return;
    }
    
    if (this.productForm.valid && this.selectedFiles.length >= 1 && this.selectedFiles.length <= 4) {
      this.isLoading = true;
      // Pass both form data and selected files to service
      this.productService.addProduct(this.productForm.value, this.selectedFiles).subscribe({
        next: () => {
          alert('Product added successfully!');
          this.productForm.reset();
          this.selectedFiles = [];
          this.imageError = '';
          this.initializeForm();
          this.fetchLevels();
          this.isLoading = false;
        },
        error: (err) => {
          alert('Error adding product.');
          console.error(err);
          this.isLoading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.productForm);
      if (this.selectedFiles.length < 1) {
        this.imageError = 'At least 1 image is required';
      }
    }
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
