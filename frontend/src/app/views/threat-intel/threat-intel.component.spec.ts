import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreatIntelComponent } from './threat-intel.component';

describe('ThreatIntelComponent', () => {
  let component: ThreatIntelComponent;
  let fixture: ComponentFixture<ThreatIntelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreatIntelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreatIntelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
