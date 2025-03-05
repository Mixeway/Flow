import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudVulnerabilitiesTableComponent } from './cloud-vulnerabilities-table.component';

describe('CloudVulnerabilitiesTableComponent', () => {
  let component: CloudVulnerabilitiesTableComponent;
  let fixture: ComponentFixture<CloudVulnerabilitiesTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloudVulnerabilitiesTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloudVulnerabilitiesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
