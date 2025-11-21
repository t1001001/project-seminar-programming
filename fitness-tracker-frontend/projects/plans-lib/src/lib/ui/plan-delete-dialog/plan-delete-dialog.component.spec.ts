import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanDeleteDialogComponent } from './plan-delete-dialog.component';

describe('PlanDeleteDialogComponent', () => {
  let component: PlanDeleteDialogComponent;
  let fixture: ComponentFixture<PlanDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanDeleteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
