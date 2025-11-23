import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface DeleteDialogData {
  exerciseName: string;
}

@Component({
  selector: 'ex-exercise-delete-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './exercise-delete-dialog.html',
  styleUrl: './exercise-delete-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseDeleteDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ExerciseDeleteDialogComponent>);
  readonly data = inject<DeleteDialogData>(MAT_DIALOG_DATA);

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
