import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface SessionDeleteDialogData {
  sessionName: string;
}

@Component({
  selector: 'lib-session-delete-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './session-delete-dialog.html',
  styleUrl: './session-delete-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionDeleteDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<SessionDeleteDialogComponent>);
  readonly data = inject<SessionDeleteDialogData>(MAT_DIALOG_DATA);

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
