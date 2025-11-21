import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlansOverviewComponent } from './plans-overview.component';

describe('PlansOverviewComponent', () => {
  let component: PlansOverviewComponent;
  let fixture: ComponentFixture<PlansOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlansOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlansOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
