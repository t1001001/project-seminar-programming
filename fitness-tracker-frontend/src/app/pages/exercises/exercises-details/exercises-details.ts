import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ExerciseDetailComponent } from 'exercises-lib';

@Component({
  selector: 'app-exercises-details',
  imports: [ExerciseDetailComponent],
  template: `<ex-exercise-detail />`,
  styleUrl: './exercises-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExercisesDetails {}
