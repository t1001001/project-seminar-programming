import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Exercise } from '../../provider-services/exercise-provider.service';

@Component({
  selector: 'ex-exercise-form-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  templateUrl: './exercise-form-dialog.component.html',
  styleUrl: './exercise-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseFormDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ExerciseFormDialogComponent>);
  private readonly fb = inject(FormBuilder);

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    category: ['', [Validators.required]],
    description: [''],
    muscleGroups: ['', [Validators.required]],
  });

  onCreate(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const exercise: Omit<Exercise, 'id'> = {
        name: formValue.name?.trim() || '',
        category: formValue.category?.trim() || '',
        description: formValue.description?.trim() || '',
        muscleGroups: formValue.muscleGroups
          ? formValue.muscleGroups.split(',').map((group: string) => group.trim())
          : [],
      };
      this.dialogRef.close(exercise);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
