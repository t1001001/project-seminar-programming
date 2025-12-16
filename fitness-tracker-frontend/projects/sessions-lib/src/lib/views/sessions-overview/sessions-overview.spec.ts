import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsOverviewComponent } from './sessions-overview';

describe('SessionsOverviewComponent', () => {
  let component: SessionsOverviewComponent;
  let fixture: ComponentFixture<SessionsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionsOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
