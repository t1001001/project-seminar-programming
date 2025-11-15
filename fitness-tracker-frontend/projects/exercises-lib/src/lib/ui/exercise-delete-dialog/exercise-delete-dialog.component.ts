import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface DeleteDialogData {
  exerciseName: string;
}

@Component({
  selector: 'ex-exercise-delete-dialog',
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './exercise-delete-dialog.component.html',
  styleUrl: './exercise-delete-dialog.component.scss',
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
