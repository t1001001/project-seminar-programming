import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Exercise } from '../../domain/models/exercise.model';
import { ExerciseManagerService } from '../../services/business/exercise-manager.service';
import { ExerciseCardComponent } from '../../ui/exercise-card/exercise-card.component';

@Component({
  selector: 'ex-exercises-dashboard',
  imports: [AsyncPipe, ExerciseCardComponent],
  template: `
    <section class="exercise-dashboard">
      <h2>Exercises</h2>

      @if (exercises$ | async; as exercises) {
        @if (!exercises.length) {
          <p class="empty-state">
            No exercises available. Create one to get started.
          </p>
        }
        @if (exercises.length) {
          <div class="list">
            @for (exercise of exercises; track exercise.id) {
              <ex-exercise-card [exercise]="exercise" />
            }
          </div>
        }
      } @else {
        <p>Loading exercises…</p>
      }
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
