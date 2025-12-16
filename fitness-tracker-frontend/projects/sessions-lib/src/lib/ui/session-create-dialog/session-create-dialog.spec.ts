import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionCreateDialogComponent } from './session-create-dialog';

describe('SessionCreateDialogComponent', () => {
    let component: SessionCreateDialogComponent;
    let fixture: ComponentFixture<SessionCreateDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SessionCreateDialogComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SessionCreateDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
