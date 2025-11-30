import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionsDetails } from './sessions-details';

describe('SessionsDetails', () => {
  let component: SessionsDetails;
  let fixture: ComponentFixture<SessionsDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionsDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SessionsDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
