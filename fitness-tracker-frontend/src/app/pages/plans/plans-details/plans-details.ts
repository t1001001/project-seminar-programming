import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PlanDetailComponent } from 'plans-lib';

@Component({
    selector: 'app-plans-details',
    imports: [PlanDetailComponent],
    template: `<lib-plan-detail />`,
    styleUrl: './plans-details.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlansDetails { }
