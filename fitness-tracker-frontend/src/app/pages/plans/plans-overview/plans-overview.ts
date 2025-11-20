import { Component } from '@angular/core';
import { PlansOverviewComponent } from 'plans-lib';

@Component({
    selector: 'app-plans-overview',
    imports: [PlansOverviewComponent],
    template: `<lib-plans-overview />`,
    styleUrl: './plans-overview.scss',
})
export class PlansOverview { }
