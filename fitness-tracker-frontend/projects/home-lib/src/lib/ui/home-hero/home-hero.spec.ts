import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeHero } from './home-hero';

describe('HomeHero', () => {
  let component: HomeHero;
  let fixture: ComponentFixture<HomeHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeHero]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeHero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
