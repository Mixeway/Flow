import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ThreatListComponent} from './threat-list.component';
import {provideHttpClient} from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {provideNoopAnimations} from "@angular/platform-browser/animations";

describe('ThreatListComponent', () => {
  let component: ThreatListComponent;
  let fixture: ComponentFixture<ThreatListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreatListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations()
      ]
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
