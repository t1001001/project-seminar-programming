import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HomeLanding as HomeLandingLib } from 'home-lib';

@Component({
    selector: 'app-home-landing',
    imports: [HomeLandingLib],
    template: '<home-home-landing />',
    styleUrl: './home-landing.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeLanding { }
