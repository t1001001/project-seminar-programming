import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanFormDialogComponent } from './plan-form-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

describe('PlanFormDialogComponent', () => {
    let component: PlanFormDialogComponent;
    let fixture: ComponentFixture<PlanFormDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PlanFormDialogComponent],
            providers: [
                { provide: MatDialogRef, useValue: {} },
                { provide: MAT_DIALOG_DATA, useValue: {} },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(PlanFormDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
