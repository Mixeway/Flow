import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreatListComponent } from './threat-list.component';

describe('ThreatListComponent', () => {
  let component: ThreatListComponent;
  let fixture: ComponentFixture<ThreatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreatListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreatListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
