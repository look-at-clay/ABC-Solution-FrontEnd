import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LevelService } from '../../services/level.services';

@Component({
  selector: 'app-level-dialogue',
  standalone: false,
  templateUrl: './level-dialogue.component.html',
  styleUrl: './level-dialogue.component.css'
})
export class LevelDialogueComponent {
  addLevelForm: FormGroup;
  deleteLevelForm: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    public dialogRef: MatDialogRef<LevelDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { totalLevels: number },
    private fb: FormBuilder,
    private levelService: LevelService
  ) {
    this.addLevelForm = this.fb.group({
      name: ['', [Validators.required]]
    });

    this.deleteLevelForm = this.fb.group({
      levelId: ['', [Validators.required]]
    });
  }

  addLevel(): void {
    if (this.addLevelForm.invalid) return;
    
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';
    
    const levelData = this.addLevelForm.value;
    
    this.levelService.addLevel(levelData).subscribe({
      next: (response) => {
        this.successMessage = 'Level added successfully!';
        this.addLevelForm.reset();
        this.isSubmitting = false;
        // Update the total levels count
        this.data.totalLevels++;
      },
      error: (error) => {
        this.errorMessage = 'Failed to add level. Please try again.';
        console.error('Error adding level:', error);
        this.isSubmitting = false;
      }
    });
  }

  deleteLevel(): void {
    if (this.deleteLevelForm.invalid) return;
    
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';
    
    const levelId = this.deleteLevelForm.get('levelId')?.value;
    
    this.levelService.deleteLevel(levelId).subscribe({
      next: (response) => {
        this.successMessage = `Level ${levelId} deleted successfully!`;
        this.deleteLevelForm.reset();
        this.isSubmitting = false;
        // Update the total levels count
        this.data.totalLevels--;
      },
      error: (error) => {
        this.errorMessage = `Failed to delete level ${levelId}. Please verify the ID and try again.`;
        console.error('Error deleting level:', error);
        this.isSubmitting = false;
      }
    });
  }
}
