import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionEditDialogComponent } from './session-edit-dialog';

describe('SessionEditDialogComponent', () => {
  let component: SessionEditDialogComponent;
  let fixture: ComponentFixture<SessionEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SessionEditDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SessionEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
