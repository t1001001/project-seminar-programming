import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Exercise } from '../../domain/models/exercise.model';
import { ExerciseService } from '../../services/business/exercise.service';
import { ExerciseCardComponent } from '../../ui/exercise-card/exercise-card.component';
import { ExerciseDeleteDialogComponent, DeleteDialogData } from '../../ui/exercise-delete-dialog/exercise-delete-dialog.component';
import { ExerciseFormDialogComponent } from '../../ui/exercise-form-dialog/exercise-form-dialog.component';

@Component({
  selector: 'ex-exercises-overview',
  imports: [AsyncPipe, ExerciseCardComponent, MatButtonModule],
  templateUrl: './exercises-overview.component.html',
  styleUrl: './exercises-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExercisesOverviewComponent {
  private readonly exerciseService = inject(ExerciseService);
  private readonly dialog = inject(MatDialog);

  readonly exercises$: Observable<Exercise[]> = this.exerciseService.loadExercises();

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ExerciseFormDialogComponent, {
      width: '500px',
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((result: Omit<Exercise, 'id'> | undefined) => {
      if (result) {
        this.exerciseService.createExercise(result);
      }
    });
  }

  onDelete(id: string, name: string): void {
    const dialogRef = this.dialog.open(ExerciseDeleteDialogComponent, {
      width: '400px',
      data: { exerciseName: name } as DeleteDialogData,
      panelClass: 'custom-dialog-container',
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.exerciseService.removeExercise(id);
      }
    });
  }
}
