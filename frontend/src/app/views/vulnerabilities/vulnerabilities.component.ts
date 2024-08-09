import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../service/AuthService";
import { Router } from "@angular/router";
import { VulnerabilityService } from "../../service/VulnerabilityService";
import {
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    ColComponent, FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ListGroupDirective,
    ListGroupItemDirective, ModalBodyComponent,
    ModalComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective,
    RowComponent, ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent
} from "@coreui/angular";
import { IconDirective, IconSetService } from "@coreui/icons-angular";
import { NgForOf, NgIf } from "@angular/common";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { brandSet, freeSet } from "@coreui/icons";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-vulnerabilities',
  standalone: true,
    imports: [
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        ColComponent,
        IconDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        ListGroupDirective,
        ListGroupItemDirective,
        NgForOf,
        NgIf,
        NgxDatatableModule,
        RowComponent,
        ModalComponent,
        ModalHeaderComponent,
        ModalBodyComponent,
        ModalFooterComponent,
        FormsModule,
        FormControlDirective,
        ButtonDirective,
        ModalTitleDirective,
        ReactiveFormsModule,
        ToastBodyComponent,
        ToastComponent,
        ToastHeaderComponent,
        ToasterComponent
    ],
  templateUrl: './vulnerabilities.component.html',
  styleUrls: ['./vulnerabilities.component.scss']
})
export class VulnerabilitiesComponent implements OnInit {
    vulns: any[] = [];
    filteredVulns: any[] = [];
    filters: { [key: string]: string } = {
        vulnerability: '',
        repos: ''
    };

    userRole: string | null = localStorage.getItem('userRole');
    editModalVisible: boolean = false;
    selectedVuln: any = null;

    editForm: FormGroup;


    constructor(private authService: AuthService, private router: Router,
                private vulnerabilityService: VulnerabilityService, public iconSet: IconSetService,
                private formBuilder: FormBuilder) {
    iconSet.icons = { ...freeSet, ...iconSet, ...brandSet };
        // Initialize the form with formBuilder
        this.editForm = this.formBuilder.group({
            description: ['', Validators.required],
            recommendation: ['', Validators.required],
            ref: ['', Validators.required]
        });
  }

    ngOnInit(): void {
        this.authService.hc().subscribe({
            next: () => {
                // Health check passed, proceed with loading the dashboard
            },
            error: () => {
                // Health check failed, redirect to login
                this.router.navigate(['/login']);
            }
        });
        this.loadVulns();
    }

    private loadVulns() {
        this.vulnerabilityService.getVulnerabilities().subscribe({
            next: (response) => {
                this.vulns = response;
                this.filteredVulns = [...this.vulns];
            },
        });
    }

    updateFilterVulnerability(event: any) {
        const val = event.target.value.toLowerCase();
        this.filters['vulnerability'] = val;
        this.applyFilters();
    }

    updateFilterRepos(event: any) {
        const val = event.target.value.toLowerCase();
        this.filters['repos'] = val;
        this.applyFilters();
    }

    applyFilters() {
        this.filteredVulns = this.vulns.filter(vuln => {
            const matchesVulnerability = vuln.vulnerability.name.toLowerCase().includes(this.filters['vulnerability']);
            const matchesRepos = vuln.affectedRepositories.some((repo: string) => repo.toLowerCase().includes(this.filters['repos']));
            return matchesVulnerability && matchesRepos;
        });
    }

    clearFilter(filterType: string) {
        this.filters[filterType] = '';
        this.applyFilters();
    }

    openEditModal(row: any) {
        // Initialize the form fields with the selected row's data using patchValue
        this.selectedVuln = row;
        this.editForm.patchValue({
            description: row.vulnerability.description || '',
            recommendation: row.vulnerability.recommendation || '',
            ref: row.vulnerability.ref || ''
        });
        this.editModalVisible = true;
    }

    closeEditModal() {
        this.editModalVisible = false;
    }

    submitEditForm() {
        if (this.editForm.valid) {
            const updatedData = {
                id: this.selectedVuln.vulnerability.id,
                ...this.editForm.value
            };

            this.vulnerabilityService.patchVuln(updatedData).subscribe({
                next: (response) => {
                    this.toastStatus = "success"
                    this.toastMessage = "Successfully edited details of vulnerability"
                    this.toggleToast();
                },
                error: (error) => {
                    this.toastStatus = "danger"
                    this.toastMessage = "Problem changing updating details of the vulnerability."
                    this.toggleToast();
                }
            });

            this.closeEditModal();
        } else {
            console.error('Form is invalid');
        }
    }

    position = 'top-end';
    visible = false;
    percentage = 0;
    toastMessage: string = ""
    toastStatus: string = ""

    toggleToast() {
        this.visible = !this.visible;
    }

    onVisibleChange($event: boolean) {
        this.visible = $event;
        this.percentage = !this.visible ? 0 : this.percentage;
    }
}