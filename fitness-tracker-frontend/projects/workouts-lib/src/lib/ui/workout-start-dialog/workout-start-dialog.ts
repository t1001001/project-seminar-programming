import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface WorkoutStartDialogData {
  sessionName: string;
}

@Component({
  selector: 'lib-workout-start-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './workout-start-dialog.html',
  styleUrl: './workout-start-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutStartDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<WorkoutStartDialogComponent>);
  private readonly data = inject<WorkoutStartDialogData>(MAT_DIALOG_DATA);

  readonly sessionName = this.data.sessionName;

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onCreate(): void {
    this.dialogRef.close(true);
  }
}
