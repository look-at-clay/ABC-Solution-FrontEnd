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
  existingAliases: any[] = [];
  isLoading = false;
  isLoadingAliases = false;
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
    
    // Listen for level selection changes
    this.aliasForm.get('levelId')?.valueChanges.subscribe(levelId => {
      if (levelId) {
        this.loadExistingAliases(levelId);
      } else {
        this.existingAliases = [];
      }
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

  loadExistingAliases(levelId: number): void {
    this.isLoadingAliases = true;
    this.levelService.getLevelAliases(levelId).subscribe({
      next: (aliases) => {
        this.existingAliases = aliases || [];
        this.isLoadingAliases = false;
      },
      error: (err) => {
        console.error('Error loading existing aliases:', err);
        this.existingAliases = [];
        this.isLoadingAliases = false;
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
        // Reload existing aliases to show the newly added one
        this.loadExistingAliases(aliasData.levelId);
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

  getLevelName(levelId: number): string {
    const level = this.levels.find(l => l.id == levelId);
    return level ? level.name : '';
  }

  onClose(): void {
    this.dialogRef.close();
  }
}