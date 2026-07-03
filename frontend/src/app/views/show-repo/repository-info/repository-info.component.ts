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
    tokenModalVisible = false;
    tokenSaving = false;
    tokenError: string | null = null;
    tokenForm = { accessToken: '' };

    scanDropdownOpen = false;
    branchScanModalVisible = false;
    loadingBranches = false;
    availableBranches: string[] = [];
    selectedBranch = '';
    branchLoadError: string | null = null;

    sbomModalVisible = false;
    sbomBranch = '';
    sbomError: string | null = null;
    sbomFile: File | null = null;
    sbomAvailableBranches: string[] = [];

  @Output() runScanEvent = new EventEmitter<void>();
  @Output() runScanBranchEvent = new EventEmitter<string>();
  @Output() uploadSbomScanEvent = new EventEmitter<{ file: File; branch?: string }>();
  @Output() openChangeTeamModalEvent = new EventEmitter<void>();
  @Output() deleteRepoEvent = new EventEmitter<void>();

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
    this.scanDropdownOpen = false;
    this.runScanEvent.emit();
  }

  toggleScanDropdown(): void {
    this.scanDropdownOpen = !this.scanDropdownOpen;
  }

  openBranchScanModal(): void {
    this.scanDropdownOpen = false;
    this.branchScanModalVisible = true;
    this.selectedBranch = '';
    this.branchLoadError = null;
    this.availableBranches = [];
    this.loadingBranches = true;
    const id = this.repoData?.id;
    if (!id) return;
    this.codeService.getRemoteBranches(id).subscribe({
      next: (branches) => {
        this.availableBranches = branches;
        this.loadingBranches = false;
      },
      error: () => {
        this.branchLoadError = 'Failed to load branches.';
        this.loadingBranches = false;
      }
    });
  }

  confirmBranchScan(): void {
    if (!this.selectedBranch) return;
    this.branchScanModalVisible = false;
    this.runScanBranchEvent.emit(this.selectedBranch);
  }

  openSbomUploadModal(): void {
    this.scanDropdownOpen = false;
    this.sbomModalVisible = true;
    this.sbomError = null;
    this.sbomFile = null;
    this.sbomAvailableBranches = this.getDbBranchNames();
    this.sbomBranch = this.repoData?.defaultBranch?.name ?? '';
    if (!this.sbomAvailableBranches.includes(this.sbomBranch)) {
      this.sbomBranch = this.sbomAvailableBranches[0] ?? '';
    }
  }

  onSbomFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;
    this.sbomFile = file;
    this.sbomError = null;
  }

  confirmSbomUpload(): void {
    if (!this.sbomFile) {
      this.sbomError = 'Choose a JSON SBOM file.';
      return;
    }
    const name = this.sbomFile.name.toLowerCase();
    if (!name.endsWith('.json')) {
      this.sbomError = 'File must be JSON (e.g. CycloneDX .json).';
      return;
    }
    const branch = (this.sbomBranch || '').trim();
    this.sbomModalVisible = false;
    this.uploadSbomScanEvent.emit({
      file: this.sbomFile,
      branch: branch.length > 0 ? branch : undefined,
    });
  }

  private getDbBranchNames(): string[] {
    const names = new Set<string>();
    const defaultBranchName = this.repoData?.defaultBranch?.name;
    if (defaultBranchName) {
      names.add(defaultBranchName);
    }

    const branches = this.repoData?.branches ?? [];
    for (const branch of branches) {
      const branchName = branch?.name;
      if (branchName) {
        names.add(branchName);
      }
    }

    return Array.from(names).sort((a, b) => a.localeCompare(b));
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
    openTokenModal() {
        this.tokenError = null;
        this.tokenForm.accessToken = '';
        this.tokenModalVisible = true;
    }
    requestDeleteRepo(): void {
        this.deleteRepoEvent.emit();
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
    confirmTokenChange() {
        const id = this.repoData?.id;
        if (!id) return;

        const trimmed = (this.tokenForm.accessToken || '').trim();
        if (!trimmed) {
            this.tokenError = 'Access token cannot be empty.';
            return;
        }

        this.tokenSaving = true;
        this.codeService.changeAccessToken(id, trimmed).subscribe({
            next: () => {
                this.tokenSaving = false;
                this.tokenModalVisible = false;
                this.tokenForm.accessToken = '';
            },
            error: (err) => {
                this.tokenSaving = false;
                this.tokenError = err?.error?.message || 'Token update failed.';
            }
        });
    }
}