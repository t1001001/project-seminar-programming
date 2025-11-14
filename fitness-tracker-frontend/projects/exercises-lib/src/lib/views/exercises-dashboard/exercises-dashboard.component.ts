import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Exercise } from '../../domain/models/exercise.model';
import { ExerciseManagerService } from '../../services/business/exercise-manager.service';
import { ExerciseCardComponent } from '../../ui/exercise-card/exercise-card.component';

@Component({
  selector: 'ex-exercises-dashboard',
  standalone: true,
  imports: [CommonModule, ExerciseCardComponent],
  template: `
    <section class="exercise-dashboard">
      <h2>Exercises</h2>

      <ng-container *ngIf="exercises$ | async as exercises; else loading">
        <p *ngIf="!exercises.length" class="empty-state">
          No exercises available. Create one to get started.
        </p>

        <div class="list" *ngIf="exercises.length">
          <ex-exercise-card
            *ngFor="let exercise of exercises"
            [exercise]="exercise"
          ></ex-exercise-card>
        </div>
      </ng-container>

      <ng-template #loading>
        <p>Loading exercises…</p>
      </ng-template>
    </section>
  `,
  styles: [
    `
      .exercise-dashboard {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 1rem;
      }

      .empty-state {
        color: #475569;
        font-style: italic;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExercisesDashboardComponent {
  private readonly exerciseManager = inject(ExerciseManagerService);

  readonly exercises$: Observable<Exercise[]> = this.exerciseManager.loadExercises();
}
