import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsDashboardComponent } from './sessions-dashboard.component';

describe('SessionsDashboardComponent', () => {
  let component: SessionsDashboardComponent;
  let fixture: ComponentFixture<SessionsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionsDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
