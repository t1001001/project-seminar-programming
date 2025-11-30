import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { SessionOverview } from '../../logic-services/session-logic.service';

@Component({
  selector: 'lib-session-card',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './session-card.html',
  styleUrl: './session-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionCardComponent {
  private readonly router = inject(Router);
  session = input.required<SessionOverview>();
  delete = output<SessionOverview>();

  onCardClick(): void {
    this.router.navigate(['/sessions', this.session().id]);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.session());
  }
}
