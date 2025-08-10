import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { CategoryService, Category, CreateCategoryRequest, UpdateCategoryRequest } from '../../services/category.services';
import { ProductService } from '../../services/product.services';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category-management-dialogue',
  standalone: false,
  templateUrl: './category-management-dialogue.component.html',
  styleUrls: ['./category-management-dialogue.component.css']
})
export class CategoryManagementDialogueComponent implements OnInit {
  categories: Category[] = [];
  products: any[] = [];
  loading = false;
  error = '';
  
  // Form states
  showAddForm = false;
  editingCategory: Category | null = null;
  showAssignForm = false;
  selectedCategoryForAssign: Category | null = null;
  
  // Form data
  newCategoryName = '';
  editCategoryName = '';
  selectedProductId: number | null = null;

  constructor(
    private dialogRef: MatDialogRef<CategoryManagementDialogueComponent>,
    private categoryService: CategoryService,
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load categories';
        this.loading = false;
        this.showSnackBar('Failed to load categories', 'error');
      }
    });
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: (error) => {
        this.showSnackBar('Failed to load products', 'error');
      }
    });
  }

  // Add Category
  showAddCategoryForm(): void {
    this.showAddForm = true;
    this.newCategoryName = '';
  }

  cancelAddCategory(): void {
    this.showAddForm = false;
    this.newCategoryName = '';
  }

  addCategory(): void {
    if (!this.newCategoryName.trim()) {
      this.showSnackBar('Category name is required', 'error');
      return;
    }

    const request: CreateCategoryRequest = {
      name: this.newCategoryName.trim()
    };

    this.categoryService.addCategory(request).subscribe({
      next: (category) => {
        this.categories.push(category);
        this.showAddForm = false;
        this.newCategoryName = '';
        this.showSnackBar('Category added successfully', 'success');
      },
      error: (error) => {
        this.showSnackBar('Failed to add category', 'error');
      }
    });
  }

  // Edit Category
  startEditCategory(category: Category): void {
    this.editingCategory = category;
    this.editCategoryName = category.name;
  }

  cancelEditCategory(): void {
    this.editingCategory = null;
    this.editCategoryName = '';
  }

  updateCategory(): void {
    if (!this.editingCategory || !this.editCategoryName.trim()) {
      this.showSnackBar('Category name is required', 'error');
      return;
    }

    const request: UpdateCategoryRequest = {
      name: this.editCategoryName.trim()
    };

    this.categoryService.updateCategory(this.editingCategory.id, request).subscribe({
      next: (updatedCategory) => {
        const index = this.categories.findIndex(c => c.id === this.editingCategory!.id);
        if (index !== -1) {
          this.categories[index] = updatedCategory;
        }
        this.editingCategory = null;
        this.editCategoryName = '';
        this.showSnackBar('Category updated successfully', 'success');
      },
      error: (error) => {
        this.showSnackBar('Failed to update category', 'error');
      }
    });
  }

  // Delete Category
  deleteCategory(category: Category): void {
    if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      this.categoryService.deleteCategory(category.id).subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c.id !== category.id);
          this.showSnackBar('Category deleted successfully', 'success');
        },
        error: (error) => {
          this.showSnackBar('Failed to delete category', 'error');
        }
      });
    }
  }

  // Assign Product
  showAssignProductForm(category: Category): void {
    this.selectedCategoryForAssign = category;
    this.showAssignForm = true;
    this.selectedProductId = null;
  }

  cancelAssignProduct(): void {
    this.showAssignForm = false;
    this.selectedCategoryForAssign = null;
    this.selectedProductId = null;
  }

  assignProduct(): void {
    if (!this.selectedCategoryForAssign || !this.selectedProductId) {
      this.showSnackBar('Please select a product', 'error');
      return;
    }

    this.categoryService.assignProductToCategory(
      this.selectedCategoryForAssign.id,
      this.selectedProductId
    ).subscribe({
      next: () => {
        this.showSnackBar('Product assigned successfully', 'success');
        this.cancelAssignProduct();
        this.loadCategories(); // Refresh to update product counts
      },
      error: (error) => {
        this.showSnackBar('Failed to assign product', 'error');
      }
    });
  }

  private showSnackBar(message: string, type: 'success' | 'error'): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: type === 'success' ? 'success-snackbar' : 'error-snackbar'
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}