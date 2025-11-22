import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HomeHero } from '../../ui/home-hero/home-hero';

@Component({
  selector: 'home-home-landing',
  imports: [HomeHero],
  templateUrl: './home-landing.html',
  styleUrl: './home-landing.css',
})
export class HomeLanding {

}
