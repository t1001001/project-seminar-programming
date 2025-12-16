import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WorkoutDetailComponent } from 'workouts-lib';

@Component({
  selector: 'app-workouts-details',
  imports: [WorkoutDetailComponent],
  templateUrl: './workouts-details.html',
  styleUrl: './workouts-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutsDetails {}



