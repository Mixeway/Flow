import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ToastApplicationComponent} from './toast-application.component';
import {provideHttpClient} from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {provideNoopAnimations} from "@angular/platform-browser/animations";

describe('ToastComponent', () => {
  let component: ToastApplicationComponent;
  let fixture: ComponentFixture<ToastApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastApplicationComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideNoopAnimations()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToastApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
