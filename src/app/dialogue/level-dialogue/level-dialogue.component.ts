import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LevelService } from '../../services/level.services';

@Component({
  selector: 'app-level-dialogue',
  standalone: false,
  templateUrl: './level-dialogue.component.html',
  styleUrl: './level-dialogue.component.css'
})
export class LevelDialogueComponent implements OnInit {
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';
  levels: any[] = [];
  highestLevel: number = 0;

  constructor(
    public dialogRef: MatDialogRef<LevelDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { totalLevels: number },
    private levelService: LevelService
  ) {}

  ngOnInit(): void {
    this.fetchLevels();
  }

  fetchLevels(): void {
    this.isSubmitting = true;
    this.levelService.getAllLevels().subscribe({
      next: (levels) => {
        this.levels = levels;
        this.data.totalLevels = levels.length;
        this.highestLevel = levels.length > 0 ? 
          Math.max(...levels.map(level => level.name)) : 0;
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error fetching levels:', error);
        this.errorMessage = 'Could not fetch levels';
        this.isSubmitting = false;
      }
    });
  }

  addLevel(): void {
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';
    
    const newLevelValue = this.highestLevel + 1;
    const levelData = { name: newLevelValue };
    
    this.levelService.addLevel(levelData).subscribe({
      next: (response) => {
        this.successMessage = `Level ${newLevelValue} added successfully!`;
        this.isSubmitting = false;
        this.fetchLevels(); // Refresh the levels list
      },
      error: (error) => {
        this.errorMessage = 'Failed to add level. Please try again.';
        console.error('Error adding level:', error);
        this.isSubmitting = false;
      }
    });
  }

  // d:\Maven_Projects\ABC_Solution\abcsolution-frontend\src\app\dialogue\level-dialogue\level-dialogue.component.ts
  deleteHighestLevel(): void {
    if (this.levels.length === 0) {
      this.errorMessage = 'No levels to delete';
      return;
    }
    
    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';
    
    // Find the level with the highest name value
    const highestLevelObj = this.levels.reduce((prev, current) => 
      (prev.name > current.name) ? prev : current);
    
    this.levelService.deleteLevel(highestLevelObj.id).subscribe({
      next: (response: any) => {
        this.successMessage = `Level ${highestLevelObj.name} deleted successfully!`;
        this.isSubmitting = false;
        this.fetchLevels(); // Refresh the levels list
      },
      error: (error) => {
        // Check if it's actually a success (status 200) but being treated as an error
        if (error && error.status === 200) {
          this.successMessage = `Level ${highestLevelObj.name} deleted successfully!`;
          this.isSubmitting = false;
          this.fetchLevels(); // Refresh the levels list
        } else {
          this.errorMessage = `Failed to delete level. Please try again.`;
          console.error('Error deleting level:', error);
          this.isSubmitting = false;
        }
      }
    });
  }
}