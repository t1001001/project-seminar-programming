import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlansDashboardComponent } from './plans-dashboard.component';

describe('PlansDashboardComponent', () => {
  let component: PlansDashboardComponent;
  let fixture: ComponentFixture<PlansDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlansDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlansDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
