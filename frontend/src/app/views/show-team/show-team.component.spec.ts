import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ShowTeamComponent} from './show-team.component';
import {provideHttpClient} from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {provideNoopAnimations} from "@angular/platform-browser/animations";
import {of} from "rxjs";
import {ActivatedRoute} from "@angular/router";

describe('ShowRepoComponent', () => {
  let component: ShowTeamComponent;
  let fixture: ComponentFixture<ShowTeamComponent>;

  beforeEach(async () => {
    const activatedRouteMock = {
      paramMap: of(new Map()),
      queryParamMap: of(new Map()),
      params: of({}),
      queryParams: of({}),
      snapshot: {
        paramMap: new Map(),
        queryParamMap: new Map(),
        params: {},
        queryParams: {},
        url: [],
        data: {}
      }
    };

    await TestBed.configureTestingModule({
      imports: [ShowTeamComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations(),
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
