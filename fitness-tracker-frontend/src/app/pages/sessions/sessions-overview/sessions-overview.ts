import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SessionsOverviewComponent } from 'sessions-lib';

@Component({
  selector: 'app-sessions-overview',
  imports: [SessionsOverviewComponent],
  template: `<lib-sessions-overview />`,
  styleUrl: './sessions-overview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionsOverview { }
