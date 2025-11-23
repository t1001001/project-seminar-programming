import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeHeatmap } from './home-heatmap';

describe('HomeHeatmap', () => {
  let component: HomeHeatmap;
  let fixture: ComponentFixture<HomeHeatmap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeHeatmap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeHeatmap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
