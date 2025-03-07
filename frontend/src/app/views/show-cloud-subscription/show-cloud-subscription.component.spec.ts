import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCloudSubscriptionComponent } from './show-cloud-subscription.component';

describe('ShowRepoComponent', () => {
  let component: ShowCloudSubscriptionComponent;
  let fixture: ComponentFixture<ShowCloudSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowCloudSubscriptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowCloudSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
