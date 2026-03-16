import {Component, inject} from '@angular/core';
import {SharedModule} from "../../../shared/shared.module";
import {ThemeService} from "../../../service/theme/theme.service";

@Component({
  selector: 'app-last-data-upload',
  standalone: true,
  imports: [
    SharedModule
  ],
  templateUrl: './last-data-upload.component.html',
  styleUrl: './last-data-upload.component.scss'
})
export class LastDataUploadComponent {
  private themeService = inject(ThemeService);
  protected progressBarLabels: string[] = ['0%', '25%', '50%', '75%', '100%'];
  protected progressBarValue: number = 10;
  protected progressBarColor: string = this.themeService.getCssVariable('--yellow-600');

}
