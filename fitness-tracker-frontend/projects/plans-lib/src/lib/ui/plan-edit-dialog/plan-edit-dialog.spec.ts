import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanEditDialogComponent } from './plan-edit-dialog';

describe('PlanEditDialogComponent', () => {
  let component: PlanEditDialogComponent;
  let fixture: ComponentFixture<PlanEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanEditDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PlanEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
