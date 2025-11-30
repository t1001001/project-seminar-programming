import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsOverview } from './sessions-overview';

describe('SessionsOverview', () => {
  let component: SessionsOverview;
  let fixture: ComponentFixture<SessionsOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionsOverview],
    }).compileComponents();

    fixture = TestBed.createComponent(SessionsOverview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
