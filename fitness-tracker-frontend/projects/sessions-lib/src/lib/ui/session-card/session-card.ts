import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

import { SessionOverview } from '../../logic-services/session-logic.service';

@Component({
  selector: 'lib-session-card',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './session-card.html',
  styleUrl: './session-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionCardComponent {
  private readonly router = inject(Router);
  session = input.required<SessionOverview>();

  onCardClick(): void {
    this.router.navigate(['/sessions', this.session().id]);
  }
}
