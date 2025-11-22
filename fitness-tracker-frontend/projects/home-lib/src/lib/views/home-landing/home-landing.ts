import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HomeHeroSection } from '../../ui/home-hero-section/home-hero-section';

@Component({
  selector: 'home-home-landing',
  imports: [HomeHeroSection],
  templateUrl: './home-landing.html',
  styleUrl: './home-landing.css',
})
export class HomeLanding {

}
