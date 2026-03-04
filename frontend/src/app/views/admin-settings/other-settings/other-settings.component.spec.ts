import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OtherSettingsComponent} from './other-settings.component';
import {provideHttpClient} from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {provideNoopAnimations} from "@angular/platform-browser/animations";

describe('OtherSettingsComponent', () => {
  let component: OtherSettingsComponent;
  let fixture: ComponentFixture<OtherSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherSettingsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
