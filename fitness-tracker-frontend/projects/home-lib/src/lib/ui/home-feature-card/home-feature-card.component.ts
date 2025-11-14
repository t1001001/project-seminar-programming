import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { HomeFeature } from '../../domain/models/home-feature.model';

@Component({
  selector: 'home-feature-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="feature-card">
      <div class="icon" aria-hidden="true">{{ feature?.icon }}</div>
      <h3>{{ feature?.title }}</h3>
      <p>{{ feature?.description }}</p>
    </article>
  `,
  styles: [
    `
      .feature-card {
        border-radius: 0.75rem;
        border: 1px solid rgba(59, 130, 246, 0.35);
        padding: 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        background: white;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
      }

      .icon {
        font-size: 2rem;
      }

      h3 {
        font-size: 1.25rem;
        margin: 0;
        color: #0f172a;
      }

      p {
        margin: 0;
        color: #475569;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeFeatureCardComponent {
  @Input({ required: true }) feature!: HomeFeature;
}
