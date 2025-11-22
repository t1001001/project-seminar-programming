import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLanding } from './home-landing';

describe('HomeLanding', () => {
  let component: HomeLanding;
  let fixture: ComponentFixture<HomeLanding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeLanding]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeLanding);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
