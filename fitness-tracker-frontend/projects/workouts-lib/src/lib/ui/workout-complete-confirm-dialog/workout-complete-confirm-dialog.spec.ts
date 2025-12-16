import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { WorkoutCompleteConfirmDialogComponent } from './workout-complete-confirm-dialog';

describe('WorkoutCompleteConfirmDialogComponent', () => {
    let component: WorkoutCompleteConfirmDialogComponent;
    let fixture: ComponentFixture<WorkoutCompleteConfirmDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [WorkoutCompleteConfirmDialogComponent],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: { sessionName: 'Test Session' } },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(WorkoutCompleteConfirmDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
