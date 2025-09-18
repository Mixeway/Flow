import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import {
    BadgeComponent,
    ButtonCloseDirective,
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardFooterComponent,
    CardHeaderComponent,
    ColComponent,
    FormControlDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ProgressComponent,
    RowComponent,
    SpinnerComponent,
    TooltipDirective,
} from '@coreui/angular';
import { IconDirective } from '@coreui/icons-angular';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ChartjsComponent } from "@coreui/angular-chartjs";
import {FormsModule} from "@angular/forms";
import {RepoService} from "../../../service/RepoService";

@Component({
  selector: 'app-repository-info',
  standalone: true,
    imports: [
        RowComponent,
        ColComponent,
        CardComponent,
        CardBodyComponent,
        CardFooterComponent,
        ButtonDirective,
        IconDirective,
        SpinnerComponent,
        ProgressComponent,
        NgIf,
        NgFor,
        TooltipDirective,
        CardHeaderComponent,
        ChartjsComponent,
        DatePipe,
        ModalComponent,
        ModalHeaderComponent,
        ModalBodyComponent,
        FormControlDirective,
        FormsModule,
        ButtonCloseDirective,
        ModalTitleDirective,
        ModalFooterComponent,
    ],
  templateUrl: './repository-info.component.html',
  styleUrls: ['./repository-info.component.scss']
})
export class RepositoryInfoComponent implements OnInit {
  @Input() repoData: any;
  @Input() scanRunning: boolean = false;
  @Input() userRole: string = 'USER';
  @Input() topLanguages: { name: string; value: number; color: string }[] = [];
  @Input() chartPieData: any;
  @Input() options: any = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        bodyFont: {
          size: 13
        },
        padding: 10
      }
    },
    cutout: '60%'
  };

    renameModalVisible = false;
    renameSaving = false;
    renameError: string | null = null;
    renameForm = { name: '' };

  @Output() runScanEvent = new EventEmitter<void>();
  @Output() openChangeTeamModalEvent = new EventEmitter<void>();

  ngOnInit(): void {
    // Enhance chart options with better defaults
    this.options = {
      ...this.options,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.8)',
          bodyFont: {
            size: 13
          },
          padding: 10
        }
      },
      cutout: '60%'
    };
  }

  runScan(): void {
    this.runScanEvent.emit();
  }

    constructor(private codeService: RepoService) {}


    openChangeTeamModal(): void {
    this.openChangeTeamModalEvent.emit();
  }

    openRenameModal() {
        this.renameError = null;
        this.renameForm.name = this.repoData?.name ?? '';
        this.renameModalVisible = true;
    }
    confirmRename() {
        const id = this.repoData?.id;
        if (!id) return;

        const trimmed = (this.renameForm.name || '').trim();
        if (!trimmed) {
            this.renameError = 'Name cannot be empty.';
            return;
        }

        // Optional client-side check mirroring backend
        const ok = /^[\p{L}\p{N} _.\-\/]{1,200}$/u.test(trimmed);
        if (!ok) {
            this.renameError = 'Invalid name. Allowed: letters, digits, space, _ . -';
            return;
        }

        this.renameSaving = true;
        this.codeService.rename(id, trimmed).subscribe({
            next: () => {
                if (this.repoData) this.repoData.name = trimmed; // optimistic UI update
                this.renameSaving = false;
                this.renameModalVisible = false;
            },
            error: (err) => {
                this.renameSaving = false;
                this.renameError = err?.error?.message || 'Rename failed.';
            }
        });
    }
}