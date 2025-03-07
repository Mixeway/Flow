import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudSubscriptionInfoComponent } from './cloud-subscription-info.component';

describe('CloudSubscriptionInfoComponent', () => {
  let component: CloudSubscriptionInfoComponent;
  let fixture: ComponentFixture<CloudSubscriptionInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloudSubscriptionInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloudSubscriptionInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
