import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanDetailComponent } from './plan-detail';

describe('PlanDetailComponent', () => {
  let component: PlanDetailComponent;
  let fixture: ComponentFixture<PlanDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
