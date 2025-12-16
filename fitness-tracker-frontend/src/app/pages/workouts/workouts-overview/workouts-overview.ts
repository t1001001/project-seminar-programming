import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WorkoutsOverviewComponent } from 'workouts-lib';

@Component({
  selector: 'app-workouts-overview',
  imports: [WorkoutsOverviewComponent],
  templateUrl: './workouts-overview.html',
  styleUrl: './workouts-overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutsOverview {}



