import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTeamsComponent } from './manage-teams.component';

describe('ManageTeamsComponent', () => {
  let component: ManageTeamsComponent;
  let fixture: ComponentFixture<ManageTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageTeamsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
