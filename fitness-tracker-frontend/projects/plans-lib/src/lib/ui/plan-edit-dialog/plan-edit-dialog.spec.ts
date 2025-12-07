import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';

import { PlanEditDialogComponent, PlanEditDialogData } from './plan-edit-dialog';
import { PlanLogicService } from '../../logic-services/plan-logic.service';
import { SessionProviderService } from 'sessions-lib';
import { TrainingPlan, Session } from '../../provider-services/plan-provider.service';

describe('PlanEditDialogComponent', () => {
  let component: PlanEditDialogComponent;
  let fixture: ComponentFixture<PlanEditDialogComponent>;

  const session: Session = {
    id: 'session-1',
    name: 'S1',
    scheduledDate: '',
    orderID: 1,
  };

  const plan: TrainingPlan = {
    id: 'plan-1',
    name: 'Test Plan',
    description: 'desc',
    sessions: [session]
  };

  const dialogRefMock: Partial<MatDialogRef<PlanEditDialogComponent>> = {
    close: jasmine.createSpy('close')
  };

  const planLogicMock: Partial<PlanLogicService> = {
    updatePlan: jasmine.createSpy('updatePlan').and.returnValue(of(plan))
  };

  const sessionProviderMock: Partial<SessionProviderService> = {
    updateSession: jasmine.createSpy('updateSession').and.returnValue(of(session))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanEditDialogComponent],
      providers: [
        { provide: PlanLogicService, useValue: planLogicMock },
        { provide: SessionProviderService, useValue: sessionProviderMock },
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { plan } as PlanEditDialogData },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PlanEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
