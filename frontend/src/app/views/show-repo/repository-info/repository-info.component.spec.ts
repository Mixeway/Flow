import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepositoryInfoComponent } from './repository-info.component';

describe('RepositoryInfoComponent', () => {
  let component: RepositoryInfoComponent;
  let fixture: ComponentFixture<RepositoryInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepositoryInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepositoryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
