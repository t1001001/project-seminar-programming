import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanFormDialogComponent } from './plan-form-dialog.component';

describe('PlanFormDialogComponent', () => {
  let component: PlanFormDialogComponent;
  let fixture: ComponentFixture<PlanFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
