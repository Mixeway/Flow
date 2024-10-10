import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreatScoreComponent } from './threat-score.component';

describe('ThreatScoreComponent', () => {
  let component: ThreatScoreComponent;
  let fixture: ComponentFixture<ThreatScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreatScoreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreatScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
