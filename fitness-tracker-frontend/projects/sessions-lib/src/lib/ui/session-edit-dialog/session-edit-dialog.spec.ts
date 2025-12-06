import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';

import { ExerciseProviderService } from 'exercises-lib';
import { SessionLogicService } from '../../logic-services/session-logic.service';
import { SessionProviderService } from '../../provider-services/session-provider.service';
import { SessionEditDialogComponent } from './session-edit-dialog';

describe('SessionEditDialogComponent', () => {
  let component: SessionEditDialogComponent;
  let fixture: ComponentFixture<SessionEditDialogComponent>;

  const dialogRefMock = { close: jasmine.createSpy('close') };
  const snackBarMock = { open: jasmine.createSpy('open') };
  const sessionLogicMock = {
    getNextAvailablePosition: jasmine.createSpy('getNextAvailablePosition').and.returnValue(of(1)),
    createSessionWithExercises: jasmine.createSpy('createSessionWithExercises').and.returnValue(of({})),
    updateSessionWithExercises: jasmine.createSpy('updateSessionWithExercises').and.returnValue(of({})),
  };
  const sessionProviderMock = {
    getPlans: jasmine.createSpy('getPlans').and.returnValue(of([])),
  };
  const exerciseProviderMock = {
    getAllExercises: jasmine.createSpy('getAllExercises').and.returnValue(of([])),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionEditDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: null },
        { provide: SessionLogicService, useValue: sessionLogicMock },
        { provide: SessionProviderService, useValue: sessionProviderMock },
        { provide: ExerciseProviderService, useValue: exerciseProviderMock },
        { provide: MatSnackBar, useValue: snackBarMock },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SessionEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
