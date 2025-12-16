import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SessionDetailComponent } from 'sessions-lib';

@Component({
  selector: 'app-sessions-details',
  imports: [SessionDetailComponent],
  template: `<lib-session-detail />`,
  styleUrl: './sessions-details.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionsDetails { }
