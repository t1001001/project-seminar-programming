import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { WorkoutLog } from '../../provider-services/workout-provider.service';

@Component({
  selector: 'lib-workout-card',
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './workout-card.html',
  styleUrl: './workout-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkoutCardComponent {
  private readonly router = inject(Router);

  workout = input.required<WorkoutLog>();
  delete = output<string>();
  edit = output<string>();

  readonly isInProgress = computed(() => {
    return this.workout().status === 'InProgress';
  });

  readonly startedAtFormatted = computed(() => {
    const log = this.workout();
    const date = new Date(log.startedAt);
    return this.formatDateTime(date);
  });

  readonly completedAtFormatted = computed(() => {
    const log = this.workout();
    if (!log.completedAt) {
      return null;
    }
    const date = new Date(log.completedAt);
    return this.formatDateTime(date);
  });

  private formatDateTime(date: Date): string {
    const dateStr = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${dateStr}, ${timeStr}`;
  }

  onCardClick(): void {
    this.router.navigate(['/workouts', this.workout().id]);
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.workout().id);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.workout().id);
  }
}
