import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ButtonDirective,
  CardComponent,
  CardBodyComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent,
  SpinnerComponent,
  TooltipDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { DatePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-cloud-subscription-info',
  standalone: true,
  imports: [
    RowComponent,
    ColComponent,
    CardComponent,
    CardBodyComponent,
    CardHeaderComponent,
    ButtonDirective,
    IconDirective,
    SpinnerComponent,
    NgIf,
    NgFor,
    TooltipDirective,
    DatePipe,
  ],
  templateUrl: './cloud-subscription-info.component.html',
  styleUrls: ['./cloud-subscription-info.component.scss']
})
export class CloudSubscriptionInfoComponent {
  @Input() cloudSubscriptionData: any;
  @Input() scanRunning: boolean = false;
  @Input() userRole: string = 'USER';

  @Output() runScanEvent = new EventEmitter<void>();
  @Output() openChangeTeamModalEvent = new EventEmitter<void>();

  /**
   * Run a scan for the cloud subscription
   */
  runScan(): void {
    this.runScanEvent.emit();
  }

  /**
   * Open the change team modal
   */
  openChangeTeamModal(): void {
    this.openChangeTeamModalEvent.emit();
  }

  /**
   * Get the appropriate icon for the cloud provider
   */
  getProviderIcon(): string {
    const provider = this.cloudSubscriptionData?.provider?.toLowerCase();

    if (provider?.includes('aws')) {
      return 'cib-amazon-aws';
    } else if (provider?.includes('azure') || provider?.includes('microsoft')) {
      return 'cib-microsoft-azure';
    } else if (provider?.includes('gcp') || provider?.includes('google')) {
      return 'cib-google-cloud';
    }

    return 'cil-cloud';
  }

  /**
   * Get formatted provider name
   */
  getFormattedProvider(): string {
    const provider = this.cloudSubscriptionData?.provider;

    if (!provider) return 'Unknown';

    // Format provider names more nicely
    if (provider.toLowerCase().includes('aws')) {
      return 'Amazon Web Services';
    } else if (provider.toLowerCase().includes('azure')) {
      return 'Microsoft Azure';
    } else if (provider.toLowerCase().includes('gcp')) {
      return 'Google Cloud Platform';
    }

    return provider;
  }
}