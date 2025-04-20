// d:\Maven_Projects\ABC_Solution\abcsolution-frontend\src\app\dialogue\level-alias-dialogue\level-alias-dialogue.component.ts

import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LevelService } from '../../services/level.services';

@Component({
  selector: 'app-level-alias-dialogue',
  templateUrl: './level-alias-dialogue.component.html',
  styleUrls: ['./level-alias-dialogue.component.css'],
  standalone: false,
})
export class LevelAliasDialogueComponent implements OnInit {
  aliasForm: FormGroup;
  levels: any[] = [];
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private levelService: LevelService,
    public dialogRef: MatDialogRef<LevelAliasDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.aliasForm = this.fb.group({
      levelId: ['', Validators.required],
      aliasName: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.loadLevels();
  }

  loadLevels(): void {
    this.isLoading = true;
    this.levelService.getAllLevels().subscribe({
      next: (levels) => {
        this.levels = levels;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load levels. Please try again.';
        this.isLoading = false;
        console.error('Error loading levels:', err);
      }
    });
  }

  onSubmit(): void {
    if (this.aliasForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const aliasData = this.aliasForm.value;
    
    this.levelService.createLevelAlias(aliasData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Level alias created successfully!';
        this.aliasForm.reset();
        // Reset only the alias name, keep the level selected
        this.aliasForm.patchValue({
          levelId: aliasData.levelId,
          aliasName: ''
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Failed to create level alias. Please try again.';
        console.error('Error creating level alias:', err);
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}