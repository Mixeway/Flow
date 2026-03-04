import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WaiversComponent} from './waivers.component';
import {provideHttpClient} from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {provideNoopAnimations} from "@angular/platform-browser/animations";

describe('WaiversComponent', () => {
  let component: WaiversComponent;
  let fixture: ComponentFixture<WaiversComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaiversComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaiversComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
