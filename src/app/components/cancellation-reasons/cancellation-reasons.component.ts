import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CancellationReasonService } from '../../services/cancellation-reason.service';
import { CancellationReason, CreateCancellationReasonRequest, UpdateCancellationReasonRequest } from '../../models/cancellation-reason.model';

declare var bootstrap: any;

@Component({
  selector: 'app-cancellation-reasons',
  standalone: false,
  templateUrl: './cancellation-reasons.component.html',
  styleUrls: ['./cancellation-reasons.component.css']
})
export class CancellationReasonsComponent implements OnInit {
  cancellationReasons: CancellationReason[] = [];
  reasonForm: FormGroup;
  loading = false;
  isSubmitting = false;
  isDeleting = false;
  isEditMode = false;
  errorMessage = '';
  successMessage = '';
  reasonToDelete: CancellationReason | null = null;
  editingReason: CancellationReason | null = null;

  private reasonModal: any;
  private deleteModal: any;

  constructor(
    private cancellationReasonService: CancellationReasonService,
    private formBuilder: FormBuilder
  ) {
    this.reasonForm = this.formBuilder.group({
      reason: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.loadCancellationReasons();
    this.initializeModals();
  }

  private initializeModals(): void {
    // Initialize Bootstrap modals
    setTimeout(() => {
      const reasonModalElement = document.getElementById('reasonModal');
      const deleteModalElement = document.getElementById('deleteModal');
      
      if (reasonModalElement) {
        this.reasonModal = new bootstrap.Modal(reasonModalElement);
      }
      
      if (deleteModalElement) {
        this.deleteModal = new bootstrap.Modal(deleteModalElement);
      }
    }, 100);
  }

  loadCancellationReasons(): void {
    this.loading = true;
    this.clearMessages();
    
    this.cancellationReasonService.getAllCancellationReasons().subscribe({
      next: (data) => {
        this.cancellationReasons = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading cancellation reasons:', error);
        this.errorMessage = 'Failed to load cancellation reasons. Please try again.';
        this.loading = false;
      }
    });
  }

  openCreateModal(): void {
    this.isEditMode = false;
    this.editingReason = null;
    this.reasonForm.reset();
    this.clearMessages();
    
    if (this.reasonModal) {
      this.reasonModal.show();
    }
  }

  openEditModal(reason: CancellationReason): void {
    this.isEditMode = true;
    this.editingReason = reason;
    this.reasonForm.patchValue({
      reason: reason.reason
    });
    this.clearMessages();
    
    if (this.reasonModal) {
      this.reasonModal.show();
    }
  }

  onSubmit(): void {
    if (this.reasonForm.valid) {
      this.isSubmitting = true;
      this.clearMessages();
      
      const formValue = this.reasonForm.value;
      
      if (this.isEditMode && this.editingReason) {
        // Update existing reason
        const updateRequest: UpdateCancellationReasonRequest = {
          reason: formValue.reason
        };
        
        this.cancellationReasonService.updateCancellationReason(this.editingReason.id, updateRequest).subscribe({
          next: (updatedReason) => {
            this.successMessage = 'Cancellation reason updated successfully!';
            this.loadCancellationReasons();
            this.closeModal();
            this.isSubmitting = false;
            this.clearMessagesAfterDelay();
          },
          error: (error) => {
            console.error('Error updating cancellation reason:', error);
            this.errorMessage = 'Failed to update cancellation reason. Please try again.';
            this.isSubmitting = false;
          }
        });
      } else {
        // Create new reason
        const createRequest: CreateCancellationReasonRequest = {
          reason: formValue.reason
        };
        
        this.cancellationReasonService.createCancellationReason(createRequest).subscribe({
          next: (newReason) => {
            this.successMessage = 'Cancellation reason created successfully!';
            this.loadCancellationReasons();
            this.closeModal();
            this.isSubmitting = false;
            this.clearMessagesAfterDelay();
          },
          error: (error) => {
            console.error('Error creating cancellation reason:', error);
            this.errorMessage = 'Failed to create cancellation reason. Please try again.';
            this.isSubmitting = false;
          }
        });
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.reasonForm.controls).forEach(key => {
        this.reasonForm.get(key)?.markAsTouched();
      });
    }
  }

  confirmDelete(reason: CancellationReason): void {
    this.reasonToDelete = reason;
    this.clearMessages();
    
    if (this.deleteModal) {
      this.deleteModal.show();
    }
  }

  deleteReason(): void {
    if (this.reasonToDelete) {
      this.isDeleting = true;
      this.clearMessages();
      
      this.cancellationReasonService.deleteCancellationReason(this.reasonToDelete.id).subscribe({
        next: () => {
          this.successMessage = 'Cancellation reason deleted successfully!';
          this.loadCancellationReasons();
          this.closeDeleteModal();
          this.isDeleting = false;
          this.clearMessagesAfterDelay();
        },
        error: (error) => {
          console.error('Error deleting cancellation reason:', error);
          this.errorMessage = 'Failed to delete cancellation reason. Please try again.';
          this.isDeleting = false;
        }
      });
    }
  }

  private closeModal(): void {
    if (this.reasonModal) {
      this.reasonModal.hide();
    }
    this.reasonForm.reset();
    this.isEditMode = false;
    this.editingReason = null;
  }

  private closeDeleteModal(): void {
    if (this.deleteModal) {
      this.deleteModal.hide();
    }
    this.reasonToDelete = null;
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.clearMessages();
    }, 3000);
  }
}
