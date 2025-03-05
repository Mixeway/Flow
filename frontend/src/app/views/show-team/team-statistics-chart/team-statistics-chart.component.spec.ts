import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamStatisticsChartComponent } from './team-statistics-chart.component';

describe('TeamStatisticsChartComponent', () => {
  let component: TeamStatisticsChartComponent;
  let fixture: ComponentFixture<TeamStatisticsChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamStatisticsChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamStatisticsChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
