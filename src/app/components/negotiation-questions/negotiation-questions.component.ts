import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NegotiationService } from '../../services/negotiation.service';
import {
  NegotiationCategory,
  NegotiationQuestion,
  NegotiationResponse,
  CreateCategoryRequest,
  CreateQuestionRequest,
  CreateResponseRequest
} from '../../models/negotiation.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-negotiation-questions',
  standalone: false,
  templateUrl: './negotiation-questions.component.html',
  styleUrls: ['./negotiation-questions.component.css']
})
export class NegotiationQuestionsComponent implements OnInit {
  categories: NegotiationCategory[] = [];
  selectedCategory: NegotiationCategory | null = null;
  selectedQuestion: NegotiationQuestion | null = null;
  
  categoryForm: FormGroup;
  questionForm: FormGroup;
  responseForm: FormGroup;
  
  showCategoryModal = false;
  showQuestionModal = false;
  showResponseModal = false;
  
  editingCategory: NegotiationCategory | null = null;
  editingQuestion: NegotiationQuestion | null = null;
  editingResponse: NegotiationResponse | null = null;
  
  loading = false;
  expandedCategories: Set<number> = new Set();
  expandedQuestions: Set<number> = new Set();

  constructor(
    private fb: FormBuilder,
    private negotiationService: NegotiationService
  ) {
    this.categoryForm = this.fb.group({
      categoryName: ['', [Validators.required, Validators.minLength(2)]],
      displayOrder: [1, [Validators.required, Validators.min(1)]],
      isActive: [true]
    });

    this.questionForm = this.fb.group({
      questionText: ['', [Validators.required, Validators.minLength(5)]],
      templateKey: ['', [Validators.required, Validators.minLength(2)]],
      displayOrder: [1, [Validators.required, Validators.min(1)]],
      isActive: [true],
      categoryId: ['', Validators.required]
    });

    this.responseForm = this.fb.group({
      responseText: ['', [Validators.required, Validators.minLength(2)]],
      templateKey: ['', [Validators.required, Validators.minLength(2)]],
      displayOrder: [1, [Validators.required, Validators.min(1)]],
      isActive: [true],
      questionId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.negotiationService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
        Swal.fire('Error', 'Failed to load categories', 'error');
      }
    });
  }

  toggleCategory(categoryId: number): void {
    if (this.expandedCategories.has(categoryId)) {
      this.expandedCategories.delete(categoryId);
    } else {
      this.expandedCategories.add(categoryId);
    }
  }

  toggleQuestion(questionId: number): void {
    if (this.expandedQuestions.has(questionId)) {
      this.expandedQuestions.delete(questionId);
    } else {
      this.expandedQuestions.add(questionId);
    }
  }

  // Category Management
  openCategoryModal(category?: NegotiationCategory): void {
    this.editingCategory = category || null;
    if (category) {
      this.categoryForm.patchValue({
        categoryName: category.categoryName,
        displayOrder: category.displayOrder,
        isActive: category.isActive
      });
    } else {
      this.categoryForm.reset({
        categoryName: '',
        displayOrder: 1,
        isActive: true
      });
    }
    this.showCategoryModal = true;
  }

  saveCategoryForm(): void {
    if (this.categoryForm.valid) {
      const categoryData: CreateCategoryRequest = this.categoryForm.value;
      
      if (this.editingCategory) {
        this.negotiationService.updateCategory(this.editingCategory.id, categoryData).subscribe({
          next: () => {
            this.loadCategories();
            this.closeCategoryModal();
            Swal.fire('Success', 'Category updated successfully', 'success');
          },
          error: (error) => {
            console.error('Error updating category:', error);
            Swal.fire('Error', 'Failed to update category', 'error');
          }
        });
      } else {
        this.negotiationService.createCategory(categoryData).subscribe({
          next: () => {
            this.loadCategories();
            this.closeCategoryModal();
            Swal.fire('Success', 'Category created successfully', 'success');
          },
          error: (error) => {
            console.error('Error creating category:', error);
            Swal.fire('Error', 'Failed to create category', 'error');
          }
        });
      }
    }
  }

  deleteCategory(category: NegotiationCategory): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete category "${category.categoryName}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.negotiationService.deleteCategory(category.id).subscribe({
          next: () => {
            this.loadCategories();
            Swal.fire('Deleted!', 'Category has been deleted.', 'success');
          },
          error: (error) => {
            console.error('Error deleting category:', error);
            Swal.fire('Error', 'Failed to delete category', 'error');
          }
        });
      }
    });
  }

  closeCategoryModal(): void {
    this.showCategoryModal = false;
    this.editingCategory = null;
  }

  // Question Management
  openQuestionModal(categoryId: number, question?: NegotiationQuestion): void {
    this.editingQuestion = question || null;
    if (question) {
      this.questionForm.patchValue({
        questionText: question.questionText,
        templateKey: question.templateKey,
        displayOrder: question.displayOrder,
        isActive: question.isActive,
        categoryId: question.category?.id || categoryId
      });
    } else {
      this.questionForm.reset({
        questionText: '',
        templateKey: '',
        displayOrder: 1,
        isActive: true,
        categoryId: categoryId
      });
    }
    this.showQuestionModal = true;
  }

  saveQuestionForm(): void {
    if (this.questionForm.valid) {
      const formValue = this.questionForm.value;
      const questionData: CreateQuestionRequest = {
        questionText: formValue.questionText,
        templateKey: formValue.templateKey,
        displayOrder: formValue.displayOrder,
        isActive: formValue.isActive,
        category: { id: formValue.categoryId }
      };
      
      if (this.editingQuestion) {
        this.negotiationService.updateQuestion(this.editingQuestion.id, questionData).subscribe({
          next: () => {
            this.loadCategories();
            this.closeQuestionModal();
            Swal.fire('Success', 'Question updated successfully', 'success');
          },
          error: (error) => {
            console.error('Error updating question:', error);
            Swal.fire('Error', 'Failed to update question', 'error');
          }
        });
      } else {
        this.negotiationService.createQuestion(questionData).subscribe({
          next: () => {
            this.loadCategories();
            this.closeQuestionModal();
            Swal.fire('Success', 'Question created successfully', 'success');
          },
          error: (error) => {
            console.error('Error creating question:', error);
            Swal.fire('Error', 'Failed to create question', 'error');
          }
        });
      }
    }
  }

  deleteQuestion(question: NegotiationQuestion): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete question "${question.questionText}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.negotiationService.deleteQuestion(question.id).subscribe({
          next: () => {
            this.loadCategories();
            Swal.fire('Deleted!', 'Question has been deleted.', 'success');
          },
          error: (error) => {
            console.error('Error deleting question:', error);
            Swal.fire('Error', 'Failed to delete question', 'error');
          }
        });
      }
    });
  }

  closeQuestionModal(): void {
    this.showQuestionModal = false;
    this.editingQuestion = null;
  }

  // Response Management
  openResponseModal(questionId: number, response?: NegotiationResponse): void {
    this.editingResponse = response || null;
    if (response) {
      this.responseForm.patchValue({
        responseText: response.responseText,
        templateKey: response.templateKey,
        displayOrder: response.displayOrder,
        isActive: response.isActive,
        questionId: response.question?.id || questionId
      });
    } else {
      this.responseForm.reset({
        responseText: '',
        templateKey: '',
        displayOrder: 1,
        isActive: true,
        questionId: questionId
      });
    }
    this.showResponseModal = true;
  }

  saveResponseForm(): void {
    if (this.responseForm.valid) {
      const formValue = this.responseForm.value;
      const responseData: CreateResponseRequest = {
        responseText: formValue.responseText,
        templateKey: formValue.templateKey,
        displayOrder: formValue.displayOrder,
        isActive: formValue.isActive,
        question: { id: formValue.questionId }
      };
      
      if (this.editingResponse) {
        this.negotiationService.updateResponse(this.editingResponse.id, responseData).subscribe({
          next: () => {
            this.loadCategories();
            this.closeResponseModal();
            Swal.fire('Success', 'Response updated successfully', 'success');
          },
          error: (error) => {
            console.error('Error updating response:', error);
            Swal.fire('Error', 'Failed to update response', 'error');
          }
        });
      } else {
        this.negotiationService.createResponse(responseData).subscribe({
          next: () => {
            this.loadCategories();
            this.closeResponseModal();
            Swal.fire('Success', 'Response created successfully', 'success');
          },
          error: (error) => {
            console.error('Error creating response:', error);
            Swal.fire('Error', 'Failed to create response', 'error');
          }
        });
      }
    }
  }

  deleteResponse(response: NegotiationResponse): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete response "${response.responseText}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.negotiationService.deleteResponse(response.id).subscribe({
          next: () => {
            this.loadCategories();
            Swal.fire('Deleted!', 'Response has been deleted.', 'success');
          },
          error: (error) => {
            console.error('Error deleting response:', error);
            Swal.fire('Error', 'Failed to delete response', 'error');
          }
        });
      }
    });
  }

  closeResponseModal(): void {
    this.showResponseModal = false;
    this.editingResponse = null;
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find(c => c.id === categoryId);
    return category ? category.categoryName : 'Unknown Category';
  }
}