import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeHeroSection } from './home-hero-section';

describe('HomeHeroSection', () => {
  let component: HomeHeroSection;
  let fixture: ComponentFixture<HomeHeroSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeHeroSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeHeroSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
