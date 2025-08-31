import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LevelService } from '../../services/level.services';
import { Level, CreateLevelRequest } from '../../models/level.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-levels-data-dialogue',
  standalone: false,
  templateUrl: './levels-data-dialogue.component.html',
  styleUrls: ['./levels-data-dialogue.component.css']
})
export class LevelsDataDialogueComponent implements OnInit {
  levels: Level[] = [];
  isLoading = false;
  newLevelName: number = 1;

  constructor(
    public dialogRef: MatDialogRef<LevelsDataDialogueComponent>,
    private levelService: LevelService
  ) {}

  ngOnInit(): void {
    this.loadLevels();
  }

  loadLevels(): void {
    this.isLoading = true;
    this.levelService.getAllLevels().subscribe({
      next: (levels) => {
        this.levels = levels;
        this.setNextLevelName();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading levels:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load levels data'
        });
        this.isLoading = false;
      }
    });
  }

  setNextLevelName(): void {
    if (this.levels.length > 0) {
      const maxLevel = Math.max(...this.levels.map(level => level.name));
      this.newLevelName = maxLevel + 1;
    } else {
      this.newLevelName = 1;
    }
  }

  addLevel(): void {
    if (!this.newLevelName || this.newLevelName <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Please enter a valid level name'
      });
      return;
    }

    // Check if level name already exists
    if (this.levels.some(level => level.name === this.newLevelName)) {
      Swal.fire({
        icon: 'warning',
        title: 'Duplicate Level',
        text: 'A level with this name already exists'
      });
      return;
    }

    const levelData: CreateLevelRequest = {
      name: this.newLevelName
    };

    this.isLoading = true;
    this.levelService.addLevel(levelData).subscribe({
      next: (newLevel) => {
        this.levels.push(newLevel);
        this.setNextLevelName();
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `Level ${newLevel.name} added successfully!`,
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (error) => {
        console.error('Error adding level:', error);
        this.isLoading = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add level'
        });
      }
    });
  }

  deleteLevel(level: Level): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete Level ${level.name}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.performDelete(level);
      }
    });
  }

  private performDelete(level: Level): void {
    this.isLoading = true;
    this.levelService.deleteLevel(level.id).subscribe({
      next: () => {
        this.levels = this.levels.filter(l => l.id !== level.id);
        this.setNextLevelName();
        this.isLoading = false;
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `Level ${level.name} has been deleted.`,
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (error) => {
        console.error('Error deleting level:', error);
        this.isLoading = false;
        // Check if it's actually a success (status 200) but being treated as an error
        if (error && error.status === 200) {
          this.levels = this.levels.filter(l => l.id !== level.id);
          this.setNextLevelName();
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: `Level ${level.name} has been deleted.`,
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to delete level'
          });
        }
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  }

  onClose(): void {
    this.dialogRef.close();
  }
}