import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserLevelStats } from '../../models/user-stats.mode';

@Component({
  selector: 'app-user-level-stats-dialogue',
  standalone: false,
  templateUrl: './user-level-stats-dialogue.component.html',
  styleUrls: ['./user-level-stats-dialogue.component.css']
})
export class UserLevelStatsDialogueComponent {
  
  constructor(
    public dialogRef: MatDialogRef<UserLevelStatsDialogueComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserLevelStats
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  getPercentage(userCount: number): number {
    return this.data.totalUsers > 0 ? (userCount / this.data.totalUsers) * 100 : 0;
  }
}
