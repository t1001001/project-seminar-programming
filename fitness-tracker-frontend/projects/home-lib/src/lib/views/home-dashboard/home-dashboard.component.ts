import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HomeFeature } from '../../domain/models/home-feature.model';
import { HomeContentService } from '../../services/business/home-content.service';
import { HomeFeatureCardComponent } from '../../ui/home-feature-card/home-feature-card.component';

@Component({
  selector: 'home-home-dashboard',
  imports: [AsyncPipe, HomeFeatureCardComponent],
  template: `
    <section class="home-dashboard">
      <header>
        <p class="eyebrow">Fitness Tracker</p>
        <h2>Welcome back</h2>
        <p class="subtext">Plan your next move and stay in sync with your goals.</p>
      </header>

      @if (features$ | async; as features) {
        <div class="features">
          @for (feature of features; track feature.title) {
            <home-feature-card [feature]="feature" />
          }
        </div>
      }
    </section>
  `,
  styles: [
    `
      .home-dashboard {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      header {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .eyebrow {
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.08em;
        color: #6366f1;
        margin: 0;
      }

      h2 {
        margin: 0;
        font-size: 2rem;
        color: #0f172a;
      }

      .subtext {
        margin: 0;
        color: #475569;
      }

      .features {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeDashboardComponent {
  private readonly contentService = inject(HomeContentService);
  protected readonly features$: Observable<HomeFeature[]> = this.contentService.loadFeatures();
}
