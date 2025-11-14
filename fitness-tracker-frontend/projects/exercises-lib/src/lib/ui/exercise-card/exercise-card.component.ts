import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Exercise } from '../../domain/models/exercise.model';

@Component({
  selector: 'ex-exercise-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="exercise-card">
      <header>
        <h3>{{ exercise?.name }}</h3>
        <span class="badge">{{ exercise?.intensity | uppercase }}</span>
      </header>
      <p>{{ exercise?.description || 'No description provided.' }}</p>
      <footer>
        Duration: {{ exercise?.durationMinutes }} min
      </footer>
    </article>
  `,
  styles: [
    `
      .exercise-card {
        border: 1px solid #e2e8f0;
        border-radius: 0.75rem;
        padding: 1rem;
        background: white;
      }
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }
      .badge {
        font-size: 0.75rem;
        text-transform: uppercase;
        color: #475569;
      }
      footer {
        margin-top: 0.5rem;
        font-size: 0.875rem;
        color: #475569;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseCardComponent {
  @Input() exercise: Exercise | null = null;
}
