import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ButtonModule, DropdownModule, GridModule, WidgetModule} from '@coreui/angular';
import {IconModule, IconSetService} from '@coreui/icons-angular';
import {ChartjsModule} from '@coreui/angular-chartjs';
import {iconSubset} from '../../../icons/icon-subset';
import {WidgetsDropdownComponent} from './widgets-dropdown.component';
import {RouterTestingModule} from '@angular/router/testing';
import {provideHttpClient} from "@angular/common/http";
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {provideNoopAnimations} from "@angular/platform-browser/animations";

describe('WidgetsDropdownComponent', () => {
  let component: WidgetsDropdownComponent;
  let fixture: ComponentFixture<WidgetsDropdownComponent>;
  let iconSetService: IconSetService;

  const mockStats = {
    activeFindings: [
      { date: '2024-01-01', findings: 10 },
      { date: '2024-01-02', findings: 15 },
      { date: '2024-01-03', findings: 12 }
    ],
    removedFindingsList: [
      { date: '2024-01-01', findings: 5 },
      { date: '2024-01-02', findings: 8 },
      { date: '2024-01-03', findings: 6 }
    ],
    reviewedFindingsList: [
      { date: '2024-01-01', findings: 20 },
      { date: '2024-01-02', findings: 25 },
      { date: '2024-01-03', findings: 22 }
    ],
    averageFixTimeList: [
      { date: '2024-01-01', findings: 3 },
      { date: '2024-01-02', findings: 4 },
      { date: '2024-01-03', findings: 3.5 }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [WidgetModule, DropdownModule, IconModule, ButtonModule, ChartjsModule, GridModule, WidgetsDropdownComponent, RouterTestingModule],
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

    fixture = TestBed.createComponent(WidgetsDropdownComponent);
    component = fixture.componentInstance;

    component.stats = mockStats;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
