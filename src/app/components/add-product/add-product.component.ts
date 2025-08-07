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
  levels: any[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';
  selectedFiles: File[] = []; // Add this for file handling

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

  // Add file selection handler
  onFileSelected(event: any): void {
    const files = event.target.files;
    this.selectedFiles = Array.from(files);
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
    const levelPricesArray = this.productForm.get('levelPrices') as FormArray;
    levelPricesArray.clear();

    if (this.levels.length > 0) {
      this.levels.forEach(level => {
        levelPricesArray.push(this.createLevelPrice(level));
      });
    } else {
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
      // Pass both form data and selected files to service
      this.productService.addProduct(this.productForm.value, this.selectedFiles).subscribe({
        next: () => {
          alert('Product added successfully!');
          this.productForm.reset();
          this.selectedFiles = []; // Clear selected files
          this.fetchLevels();
        },
        error: (err) => {
          alert('Error adding product.');
          console.error(err);
        }
      });
    } else {
      this.markFormGroupTouched(this.productForm);
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
