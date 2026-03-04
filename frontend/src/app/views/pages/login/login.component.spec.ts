import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ButtonModule, CardModule, FormModule, GridModule} from '@coreui/angular';
import {LoginComponent} from './login.component';
import {IconModule, IconSetService} from '@coreui/icons-angular';
import {iconSubset} from '../../../icons/icon-subset';
import {provideHttpClient} from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {provideNoopAnimations} from "@angular/platform-browser/animations";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let iconSetService: IconSetService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [FormModule, CardModule, GridModule, ButtonModule, IconModule, LoginComponent],
    providers: [
      IconSetService,
      provideHttpClient(),
      provideHttpClientTesting(),
      provideNoopAnimations()
    ]
})
    .compileComponents();
  });

  beforeEach(() => {
    iconSetService = TestBed.inject(IconSetService);
    iconSetService.icons = { ...iconSubset };

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
