import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamVulnerabilitiesTableComponent } from './team-vulnerabilities-table.component';

describe('TeamVulnerabilitiesTableComponent', () => {
  let component: TeamVulnerabilitiesTableComponent;
  let fixture: ComponentFixture<TeamVulnerabilitiesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamVulnerabilitiesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamVulnerabilitiesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
