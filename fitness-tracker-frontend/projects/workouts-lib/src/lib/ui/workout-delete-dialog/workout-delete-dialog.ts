import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface WorkoutDeleteDialogData {
  sessionName: string;
}

@Component({
  selector: 'lib-workout-delete-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './workout-delete-dialog.html',
  styleUrl: './workout-delete-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutDeleteDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<WorkoutDeleteDialogComponent>);
  readonly data = inject<WorkoutDeleteDialogData>(MAT_DIALOG_DATA);

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}

