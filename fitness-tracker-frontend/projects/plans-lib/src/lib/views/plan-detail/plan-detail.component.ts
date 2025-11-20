import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, catchError, of, switchMap, tap } from 'rxjs';

import { PlanLogicService } from '../../logic-services/plan-logic.service';
import { TrainingPlan, TrainingPlanUpdate } from '../../provider-services/plan-provider.service';

@Component({
    selector: 'lib-plan-detail',

    imports: [
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        DatePipe,
        AsyncPipe
    ],
    templateUrl: './plan-detail.component.html',
    styleUrl: './plan-detail.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanDetailComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly planService = inject(PlanLogicService);
    private readonly snackBar = inject(MatSnackBar);
    private readonly fb = inject(FormBuilder);

    private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);
    plan$: Observable<TrainingPlan | null> | null = null;
    currentPlan: TrainingPlan | null = null;

    isEditMode = false;
    form: FormGroup;

    constructor() {
        this.form = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            description: ['']
        });
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.plan$ = this.refreshTrigger$.pipe(
                switchMap(() => this.planService.getPlanById(id)),
                tap(plan => {
                    this.currentPlan = plan;
                    if (plan && !this.isEditMode) {
                        this.updateForm(plan);
                    }
                }),
                catchError((err) => {
                    this.snackBar.open(err.message, 'Close', {
                        duration: 5000,
                        panelClass: ['error-snackbar']
                    });
                    this.router.navigate(['/plans']);
                    return of(null);
                })
            );
        }
    }

    private updateForm(plan: TrainingPlan): void {
        this.form.patchValue({
            name: plan.name,
            description: plan.description
        });
    }

    onBack(): void {
        this.router.navigate(['/plans']);
    }

    enableEditMode(): void {
        this.isEditMode = true;
    }

    cancelEdit(): void {
        this.isEditMode = false;
        this.refreshTrigger$.next(); // Re-fetch to reset form
    }

    saveChanges(currentPlanId: string): void {
        if (this.form.invalid) return;

        const formValue = this.form.value;
        const updateData: TrainingPlanUpdate = {
            name: formValue.name,
            description: formValue.description,
            sessions: this.currentPlan?.sessions?.map(s => s.id!).filter(id => !!id) || []
        };

        this.planService.updatePlan(currentPlanId, updateData).subscribe({
            next: () => {
                this.isEditMode = false;
                this.refreshTrigger$.next(); // Reload data
                this.snackBar.open('Training plan updated successfully!', 'Close', {
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
}
