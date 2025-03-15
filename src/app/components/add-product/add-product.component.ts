import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.services';

@Component({
  selector: 'app-add-product',
  standalone: false,
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css'
})
export class AddProductComponent {
  productForm!: FormGroup;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      createdByAdmin: this.fb.group({
        id: [1, Validators.required]  // Assuming admin ID is always 1, change as needed
      }),
      levelPrices: this.fb.array([
        this.createLevelPrice(1),
        this.createLevelPrice(2),
        this.createLevelPrice(3)
      ])
    });
  }

  createLevelPrice(levelId: number): FormGroup {
    return this.fb.group({
      level: this.fb.group({ id: [levelId, Validators.required] }),
      minPrice: [0, Validators.required],
      maxPrice: [0, Validators.required],
      minQuantity: [0, Validators.required],
      maxQuantity: [0, Validators.required]
    });
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
          this.productForm.setControl('levelPrices', this.fb.array([
            this.createLevelPrice(1),
            this.createLevelPrice(2),
            this.createLevelPrice(3)
          ]));
        },
        error: (err) => {
          alert('Error adding product.');
          console.error(err);
        }
      });
    }
  }
}
