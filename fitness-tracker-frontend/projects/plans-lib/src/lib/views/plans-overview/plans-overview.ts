import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, debounceTime, shareReplay, startWith, switchMap } from 'rxjs';

import { PlanLogicService } from '../../logic-services/plan-logic.service';
import { TrainingPlan, TrainingPlanCreate } from '../../provider-services/plan-provider.service';
import { PlanCardComponent } from '../../ui/plan-card/plan-card';
import { PlanFormDialogComponent } from '../../ui/plan-form-dialog/plan-form-dialog';
import { PlanDeleteDialogComponent } from '../../ui/plan-delete-dialog/plan-delete-dialog';
import { showError, showSuccess } from '../../shared';

import { AuthService } from 'common-lib';

@Component({
    selector: 'lib-plans-overview',

    imports: [
        MatButtonModule,
        MatIconModule,
        ReactiveFormsModule,
        PlanCardComponent
    ],
    templateUrl: './plans-overview.html',
    styleUrl: './plans-overview.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class PlansOverviewComponent {
    private readonly planService = inject(PlanLogicService);
    private readonly dialog = inject(MatDialog);
    private readonly snackBar = inject(MatSnackBar);
    public readonly authService = inject(AuthService);

    readonly searchControl = new FormControl('');

    private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);

    private readonly plans = toSignal(
        this.refreshTrigger$.pipe(
            switchMap(() => this.planService.getAllPlans()),
            shareReplay(1)
        )
    );

    private readonly searchTerm = toSignal(
        this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300)),
        { initialValue: '' }
    );

    readonly filteredPlans = computed(() => {
        const plans = this.plans();
        if (!plans) return undefined;

        const term = (this.searchTerm() || '').toLowerCase();
        return plans.filter(plan =>
            plan.name.toLowerCase().includes(term) ||
            (plan.description && plan.description.toLowerCase().includes(term))
        );
    });

    readonly totalPlansCount = computed(() => this.plans()?.length);

    private refreshPlans(): void {
        this.refreshTrigger$.next();
    }

    onCreate(): void {
        const dialogRef = this.dialog.open(PlanFormDialogComponent, {
            width: '500px',
            panelClass: 'custom-dialog-container',
        });

        dialogRef.afterClosed().subscribe((result: TrainingPlanCreate | undefined) => {
            if (result) {
                this.planService.createPlan(result).subscribe({
                    next: () => {
                        this.refreshPlans();
                        showSuccess(this.snackBar, 'Training plan created successfully!');
                    },
                    error: (err) => showError(this.snackBar, err.message)
                });
            }
        });
    }

    onDelete(plan: TrainingPlan): void {
        const dialogRef = this.dialog.open(PlanDeleteDialogComponent, {
            data: { planName: plan.name },
            panelClass: 'custom-dialog-container',
        });

        dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
                this.planService.deletePlan(plan.id).subscribe({
                    next: () => {
                        this.refreshPlans();
                        showSuccess(this.snackBar, 'Training plan deleted successfully!');
                    },
                    error: (err) => showError(this.snackBar, err.message)
                });
            }
        });
    }
}
