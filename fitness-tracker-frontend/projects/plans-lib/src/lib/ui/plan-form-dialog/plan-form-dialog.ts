import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TrainingPlanCreate } from '../../provider-services/plan-provider.service';

@Component({
    selector: 'lib-plan-form-dialog',
    imports: [
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
    ],
    templateUrl: './plan-form-dialog.html',
    styleUrl: './plan-form-dialog.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanFormDialogComponent {
    private readonly dialogRef = inject(MatDialogRef<PlanFormDialogComponent>);
    private readonly fb = inject(FormBuilder);
    readonly data = inject<TrainingPlanCreate | null>(MAT_DIALOG_DATA, { optional: true });

    readonly form: FormGroup = this.fb.group({
        name: [this.data?.name || '', [Validators.required, Validators.minLength(2)]],
        description: [this.data?.description || ''],
    });

    readonly isEditMode = computed(() => !!this.data);

    onSave(): void {
        if (this.form.valid) {
            this.dialogRef.close(this.form.value);
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }
}
