import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionDeleteDialogComponent } from './session-delete-dialog';

describe('SessionDeleteDialogComponent', () => {
  let component: SessionDeleteDialogComponent;
  let fixture: ComponentFixture<SessionDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionDeleteDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SessionDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
