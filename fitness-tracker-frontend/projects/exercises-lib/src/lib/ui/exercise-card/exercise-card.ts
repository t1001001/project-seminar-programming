import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Exercise } from '../../provider-services/exercise-provider.service';

import { AuthService } from 'common-lib';

@Component({
  selector: 'ex-exercise-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './exercise-card.html',
  styleUrl: './exercise-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseCardComponent {
  private readonly router = inject(Router);
  public readonly authService = inject(AuthService);

  exercise = input.required<Exercise>();
  delete = output<string>();

  onCardClick(): void {
    this.router.navigate(['/exercises', this.exercise().id]);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.exercise().id);
  }
}
