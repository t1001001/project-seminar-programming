import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanDeleteDialogComponent } from './plan-delete-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('PlanDeleteDialogComponent', () => {
    let component: PlanDeleteDialogComponent;
    let fixture: ComponentFixture<PlanDeleteDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PlanDeleteDialogComponent],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: { planName: 'Test Plan' } },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PlanDeleteDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
