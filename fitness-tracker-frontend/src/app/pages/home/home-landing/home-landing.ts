import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HomeLandingComponent} from 'home-lib';

@Component({
    selector: 'app-home-landing',
    imports: [HomeLandingComponent],
    template: '<home-home-landing />',
    styleUrl: './home-landing.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeLanding { }
