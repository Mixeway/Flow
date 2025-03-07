import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamScanInfoComponent } from './team-scan-info.component';

describe('TeamScanInfoComponent', () => {
  let component: TeamScanInfoComponent;
  let fixture: ComponentFixture<TeamScanInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamScanInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamScanInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
