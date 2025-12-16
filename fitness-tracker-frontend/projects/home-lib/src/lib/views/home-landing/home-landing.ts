import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HomeHeroComponent } from '../../ui/home-hero/home-hero';

@Component({
  selector: 'home-home-landing',
  imports: [HomeHeroComponent],
  templateUrl: './home-landing.html',
  styleUrl: './home-landing.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeLandingComponent {

}
