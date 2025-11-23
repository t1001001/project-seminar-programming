import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TrainingPlan } from '../../provider-services/plan-provider.service';

@Component({
    selector: 'lib-plan-card',

    imports: [MatCardModule, MatButtonModule, MatIconModule],
    templateUrl: './plan-card.html',
    styleUrl: './plan-card.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanCardComponent {
    private readonly router = inject(Router);

    plan = input.required<TrainingPlan>();
    delete = output<TrainingPlan>();

    onCardClick(): void {
        this.router.navigate(['/plans', this.plan().id]);
    }

    onDelete(event: Event): void {
        event.stopPropagation();
        this.delete.emit(this.plan());
    }
}
