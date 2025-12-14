import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface WorkoutCompleteConfirmData {
  sessionName: string;
}

@Component({
  selector: 'lib-workout-complete-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './workout-complete-confirm-dialog.html',
  styleUrl: './workout-complete-confirm-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutCompleteConfirmDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<WorkoutCompleteConfirmDialogComponent>);
  private readonly data = inject<WorkoutCompleteConfirmData>(MAT_DIALOG_DATA);

  readonly sessionName = this.data.sessionName;

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
