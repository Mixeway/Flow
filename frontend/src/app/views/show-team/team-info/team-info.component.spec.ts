import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamInfoComponent } from './team-info.component';

describe('TeamInfoComponent', () => {
  let component: TeamInfoComponent;
  let fixture: ComponentFixture<TeamInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
