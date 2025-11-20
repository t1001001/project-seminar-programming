import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlansOverview } from './plans-overview';

describe('PlansOverview', () => {
    let component: PlansOverview;
    let fixture: ComponentFixture<PlansOverview>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PlansOverview]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PlansOverview);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
