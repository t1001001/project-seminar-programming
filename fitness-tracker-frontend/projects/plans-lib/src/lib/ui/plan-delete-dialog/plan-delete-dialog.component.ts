import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface DeleteDialogData {
    planName: string;
}

@Component({
    selector: 'lib-plan-delete-dialog',
    imports: [MatDialogModule, MatButtonModule, MatIconModule],
    templateUrl: './plan-delete-dialog.component.html',
    styleUrl: './plan-delete-dialog.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanDeleteDialogComponent {
    private readonly dialogRef = inject(MatDialogRef<PlanDeleteDialogComponent>);
    readonly data = inject<DeleteDialogData>(MAT_DIALOG_DATA);

    onConfirm(): void {
        this.dialogRef.close(true);
    }

    onCancel(): void {
        this.dialogRef.close(false);
    }
}
