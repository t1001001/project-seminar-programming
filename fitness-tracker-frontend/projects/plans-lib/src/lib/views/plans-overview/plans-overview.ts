import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';

import { PlanLogicService } from '../../logic-services/plan-logic.service';
import { TrainingPlan, TrainingPlanCreate } from '../../provider-services/plan-provider.service';
import { PlanCardComponent } from '../../ui/plan-card/plan-card';
import { PlanFormDialogComponent } from '../../ui/plan-form-dialog/plan-form-dialog';
import { PlanDeleteDialogComponent } from '../../ui/plan-delete-dialog/plan-delete-dialog';

@Component({
    selector: 'lib-plans-overview',

    imports: [
        MatButtonModule,
        MatIconModule,
        AsyncPipe,
        PlanCardComponent
    ],
    templateUrl: './plans-overview.html',
    styleUrl: './plans-overview.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlansOverviewComponent implements OnInit {
    private readonly planService = inject(PlanLogicService);
    private readonly dialog = inject(MatDialog);
    private readonly snackBar = inject(MatSnackBar);

    private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);
    readonly plans$: Observable<TrainingPlan[]> = this.refreshTrigger$.pipe(
        switchMap(() => this.planService.getAllPlans())
    );

    ngOnInit(): void {
        // plans$ will automatically fetch on initialization via refreshTrigger$
    }

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
                        this.snackBar.open('Training plan created successfully!', 'Close', {
                            duration: 3000,
                            panelClass: ['success-snackbar']
                        });
                    },
                    error: (err) => {
                        this.snackBar.open(err.message, 'Close', {
                            duration: 5000,
                            panelClass: ['error-snackbar']
                        });
                    }
                });
            }
        });
    }

    onDelete(id: string): void {
        // Note: Card emits only ID. Using generic name in dialog for simplicity.
        const dialogRef = this.dialog.open(PlanDeleteDialogComponent, {
            data: { planName: 'this training plan' },
            panelClass: 'custom-dialog-container',
        });

        dialogRef.afterClosed().subscribe((confirmed) => {
            if (confirmed) {
                this.planService.deletePlan(id).subscribe({
                    next: () => {
                        this.refreshPlans();
                        this.snackBar.open('Training plan deleted successfully!', 'Close', {
                            duration: 3000,
                            panelClass: ['success-snackbar']
                        });
                    },
                    error: (err) => {
                        this.snackBar.open(err.message, 'Close', {
                            duration: 5000,
                            panelClass: ['error-snackbar']
                        });
                    }
                });
            }
        });
    }
}
