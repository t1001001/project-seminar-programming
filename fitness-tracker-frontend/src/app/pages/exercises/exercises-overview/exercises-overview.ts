import { Component } from '@angular/core';
import { ExercisesOverviewComponent } from 'exercises-lib';

@Component({
  selector: 'app-exercises-overview',
  imports: [ExercisesOverviewComponent],
  template: `<ex-exercises-overview />`,
  styleUrl: './exercises-overview.scss',
})
export class ExercisesOverview {}
