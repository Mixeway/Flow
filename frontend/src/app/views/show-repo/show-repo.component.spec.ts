import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRepoComponent } from './show-repo.component';

describe('ShowRepoComponent', () => {
  let component: ShowRepoComponent;
  let fixture: ComponentFixture<ShowRepoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowRepoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowRepoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
