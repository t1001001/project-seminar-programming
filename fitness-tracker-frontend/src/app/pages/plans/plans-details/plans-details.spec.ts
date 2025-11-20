import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlansDetails } from './plans-details';

describe('PlansDetails', () => {
    let component: PlansDetails;
    let fixture: ComponentFixture<PlansDetails>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PlansDetails]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PlansDetails);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
