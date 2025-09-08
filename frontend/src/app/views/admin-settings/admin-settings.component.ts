import {Component, OnInit} from '@angular/core';
import {
    BadgeComponent,
    ButtonCloseDirective,
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    FormSelectDirective,
    GutterDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    RowComponent,
    RowDirective,
    TabDirective,
    TableDirective,
    TabPanelComponent,
    TabsComponent,
    TabsContentComponent,
    TabsListComponent,
    ToastBodyComponent,
    ToastComponent,
    ToasterComponent,
    ToastHeaderComponent
} from "@coreui/angular";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {IconDirective} from "@coreui/icons-angular";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../service/AuthService";
import {SettingsService} from "../../service/SettingsService";
import {Router} from "@angular/router";
import {UserService} from "../../service/UserService";
import {AppConfigService} from "../../service/AppConfigService";
import {OrganizationService} from "../../service/OrganizationService";

@Component({
  selector: 'app-admin-settings',
  standalone: true,
    imports: [
        BadgeComponent,
        CardBodyComponent,
        CardComponent,
        ColComponent,
        DatePipe,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormLabelDirective,
        FormSelectDirective,
        IconDirective,
        NgForOf,
        NgIf,
        NgxDatatableModule,
        ReactiveFormsModule,
        RowComponent,
        TabDirective,
        TabPanelComponent,
        TabsComponent,
        TabsContentComponent,
        TabsListComponent,
        FormFeedbackComponent,
        FormControlDirective,
        GutterDirective,
        FormDirective,
        RowDirective,
        FormsModule,
        ButtonDirective,
        ToastBodyComponent,
        ToastComponent,
        ToastHeaderComponent,
        ToasterComponent,
        ModalComponent,
        ModalHeaderComponent,
        ModalBodyComponent,
        ModalFooterComponent,
        ModalTitleDirective,
        ButtonCloseDirective,
        TableDirective
    ],
  templateUrl: './admin-settings.component.html',
  styleUrl: './admin-settings.component.scss'
})
export class AdminSettingsComponent implements OnInit{
    // For Scanner Configuration Tab
    softwareComponent: string = 'embedded';
    isEmbededDTChecked: boolean = true;
    isExternalDTChecked: boolean = false;
    isOtherSCAChecked: boolean = false;
    dependencyTrackUrl: string = '';
    apiKey: string = '';

    sast: string = 'bearer';
    iac: string = 'kics';
    secretsLeakage: string = 'gitleaks';
    dast: string = 'dast';

    // For SMTP and Notifications Tab
    smtpEnabled: boolean = false;
    smtpHost: string = '';
    smtpPort: number | null = null;
    smtpUsername: string = '';
    smtpPassword: string = '';
    smtpTls: boolean = false;
    smtpStartTls: boolean = false;
    customStylesValidated = false;
    scaConfigForm: any;
    smtpConfigForm: any;

    // For Wiz Configuration
    isWizEnabled: boolean = false;
    wizConfigForm: any;
    // Organization management
    organizations: any[] = [];
    availableUsers: any[] = [];
    selectedOrg: any = null;
    selectedOrgTeams: any[] = [];
    selectedOrgUsers: any[] = [];
    orgModalVisible = false;
    deleteModalVisible = false;
    detailsModalVisible = false;
    editMode = false;
    organizationForm: FormGroup;

    // Application run mode
    appRunMode: string = 'SAAS';


    settings: any;

    // For Authentication Tab
    authType: string = 'userPass';

    // For Other Configuration Tab
    geminiApiKey: string = 'API Key';

    constructor(private fb: FormBuilder, private authService: AuthService, private settingsService: SettingsService,
                private router: Router,
                private organizationService: OrganizationService,
                private appConfigService: AppConfigService,
                private userService: UserService) {
        this.scaConfigForm = this.fb.group({
            scaTypeEmbedded: [true],
            scaTypeExternal: [false],
            scaApiUrl: [''],
            scaApiKey: ['']
        });
        this.smtpConfigForm = this.fb.group({
            enabled: [false],
            hostname: [''],
            port: [587],
            username: [''],
            password: [''],
            tls: [false],
            startls: [false]
        });
        this.wizConfigForm = this.fb.group({
            enabled: [false],
            clientId: [''],
            secret: ['']
        });
        this.organizationForm = this.fb.group({
            id: [null],
            name: ['', Validators.required],
            planType: ['FREE'],
            adminUserId: ['', Validators.required],
            active: [true]
        });
    }

    ngOnInit() {
        this.authService.hcAdmin().subscribe({
            next: () => {
                // Health check passed, proceed with loading the dashboard
            },
            error: () => {
                // Health check failed, redirect to login
                this.router.navigate(['/login']);
            }
        });
        this.loadSettings();
        this.loadOrganizations();
        this.loadAvailableUsers();
        this.loadAppRunMode();
    }
    onWizToggleChange() {
        this.isWizEnabled = !this.isWizEnabled;
        this.wizConfigForm.patchValue({enabled: this.isWizEnabled});
    }

    configWiz() {
        if (this.wizConfigForm.valid) {
            this.settingsService.changeWiz(this.wizConfigForm.value).subscribe({
                next: (response) => {
                    this.toastStatus = "success";
                    this.toastMessage = "Successfully changed Wiz Scanner Settings";
                    this.toggleToast();
                },
                error: (error) => {
                    this.toastStatus = "danger";
                    this.toastMessage = "Problem changing configuration for Wiz Scanner. Please check your inputs.";
                    this.toggleToast();
                }
            });
        }
    }

    changeEmbededDT(){
        this.isEmbededDTChecked = true;
        this.scaConfigForm.patchValue({scaTypeEmbedded: true})
        this.scaConfigForm.patchValue({scaTypeExternal: false})
        //this.scaConfigForm.value.scaTypeEmbedded = true;
        this.isExternalDTChecked = false;
        //this.scaConfigForm.value.scaTypeExternal = false;
        this.dependencyTrackUrl = '';
        this.apiKey = '';
    }

    changeExternalDT(){
        this.isExternalDTChecked = true;
        this.isEmbededDTChecked = false;
        this.scaConfigForm.patchValue({scaTypeEmbedded: false})
        this.scaConfigForm.patchValue({scaTypeExternal: true})

    }


    onSastChange(component: string) {
        this.sast = component;
    }
    onDastChange(component: string) {
        this.dast = component;
    }

    onIacChange(component: string) {
        this.iac = component;
    }

    onSecretsLeakageChange(component: string) {
        this.secretsLeakage = component;
    }

    onSmtpToggleChange() {
        this.smtpEnabled = !this.smtpEnabled;
        this.smtpConfigForm.patchValue({enabled: this.smtpEnabled})
    }

    configSca() {
        if (this.scaConfigForm.valid ) {
            this.settingsService.changeSca(this.scaConfigForm.value).subscribe({
                next: (response) => {
                    this.toastStatus = "success"
                    this.toastMessage = "Successfully changed SCA Settings"
                    this.toggleToast();
                    },
                error: (error) => {
                    this.toastStatus = "danger"
                    this.toastMessage = "Problem changing configuration for SCA. One of the options should be set."
                    this.toggleToast();
                }
            });

        }
    }

    sonfigSMTP() {
        if (this.smtpConfigForm.valid ) {
            this.settingsService.changeSmtp(this.smtpConfigForm.value).subscribe({
                next: (response) => {
                    this.toastStatus = "success"
                    this.toastMessage = "Successfully changed SMTP Settings"
                    this.toggleToast();
                },
                error: (error) => {
                    this.toastStatus = "danger"
                    this.toastMessage = "Problem changing configuration for SMTP. One of the options should be set."
                    this.toggleToast();
                }
            });

        }
    }

    private loadSettings() {
        this.settingsService.get().subscribe({
            next: (response) => {
                this.settings  =response;
                this.scaConfigForm.patchValue({scaTypeEmbedded: this.settings.scaModeEmbeded})
                this.scaConfigForm.patchValue({scaTypeExternal: this.settings.scaModeExternal})
                this.scaConfigForm.patchValue({scaApiUrl: this.settings.scaApiUrl})
                this.scaConfigForm.patchValue({scaApiKey: "************"})

                this.smtpConfigForm.patchValue({enabled: this.settings.enableSmtp})
                this.smtpConfigForm.patchValue({hostname: this.settings.smtpHostname})
                this.smtpConfigForm.patchValue({port: this.settings.smtpPort})
                this.smtpConfigForm.patchValue({username: this.settings.smtpUsername})
                this.smtpConfigForm.patchValue({password: "************"})
                this.smtpConfigForm.patchValue({tls: this.settings.smtpTls})
                this.smtpConfigForm.patchValue({startls: this.settings.smtpStarttls})
                this.smtpEnabled = this.settings.enableSmtp;
                this.isExternalDTChecked = this.settings.scaModeExternal;

                // Add Wiz settings
                this.wizConfigForm.patchValue({enabled: this.settings.enableWiz});
                this.wizConfigForm.patchValue({clientId: this.settings.wizClientId});
                this.wizConfigForm.patchValue({secret: "************"});
                this.isWizEnabled = this.settings.enableWiz;

                this.geminiApiKey = this.settings.geminiApiKey;

            }
        });
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

    // Organizations Management Methods
    loadOrganizations() {
        this.organizationService.getAllOrganizations().subscribe({
            next: (data) => {
                this.organizations = data;
            },
            error: (error) => {
                this.toastStatus = "danger";
                this.toastMessage = "Failed to load organizations";
                this.toggleToast();
            }
        });
    }

    loadAvailableUsers() {
        this.userService.get().subscribe({
            next: (data) => {
                this.availableUsers = data;
            },
            error: (error) => {
                console.error("Failed to load users:", error);
            }
        });
    }

    loadAppRunMode() {
        this.appConfigService.getRunMode().subscribe({
            next: (data) => {
                this.appRunMode = data;
            },
            error: (error) => {
                console.error("Failed to load run mode:", error);
            }
        });
    }

    openNewOrgModal() {
        this.editMode = false;
        this.organizationForm.reset({
            planType: 'FREE',
            active: true
        });
        this.orgModalVisible = true;
    }


    editOrganization(org: any) {
        this.editMode = true;
        this.selectedOrg = org;

        // Get the admin user
        this.organizationService.getOrganizationAdmin(org.id).subscribe({
            next: (user) => {
                this.organizationForm.patchValue({
                    id: org.id,
                    name: org.name,
                    planType: org.planType,
                    adminUserId: user ? user.id : '',
                    active: org.active
                });
                this.orgModalVisible = true;
            },
            error: (error) => {
                this.toastStatus = "danger";
                this.toastMessage = "Failed to load organization admin";
                this.toggleToast();
            }
        });
    }

    saveOrganization() {
        if (this.organizationForm.valid) {
            const orgData = this.organizationForm.value;

            if (this.editMode) {
                this.organizationService.updateOrganization(orgData).subscribe({
                    next: () => {
                        this.orgModalVisible = false;
                        this.loadOrganizations();
                        this.toastStatus = "success";
                        this.toastMessage = "Organization updated successfully";
                        this.toggleToast();
                    },
                    error: (error) => {
                        this.toastStatus = "danger";
                        this.toastMessage = "Failed to update organization";
                        this.toggleToast();
                    }
                });
            } else {
                this.organizationService.createOrganization(orgData).subscribe({
                    next: () => {
                        this.orgModalVisible = false;
                        this.loadOrganizations();
                        this.toastStatus = "success";
                        this.toastMessage = "Organization created successfully";
                        this.toggleToast();
                    },
                    error: (error) => {
                        this.toastStatus = "danger";
                        this.toastMessage = "Failed to create organization";
                        this.toggleToast();
                    }
                });
            }
        }
    }

    confirmDeleteOrganization(org: any) {
        this.selectedOrg = org;
        this.deleteModalVisible = true;
    }

    deleteOrganization() {
        if (this.selectedOrg) {
            this.organizationService.deleteOrganization(this.selectedOrg.id).subscribe({
                next: () => {
                    this.deleteModalVisible = false;
                    this.loadOrganizations();
                    this.toastStatus = "success";
                    this.toastMessage = "Organization deleted successfully";
                    this.toggleToast();
                },
                error: (error) => {
                    this.toastStatus = "danger";
                    this.toastMessage = "Failed to delete organization";
                    this.toggleToast();
                }
            });
        }
    }

    viewOrganizationDetails(org: any) {
        this.selectedOrg = org;

        // Load teams and users for the selected organization
        this.organizationService.getOrganizationTeams(org.id).subscribe({
            next: (teams) => {
                this.selectedOrgTeams = teams;
            },
            error: (error) => {
                console.error("Failed to load teams:", error);
            }
        });

        this.organizationService.getOrganizationUsers(org.id).subscribe({
            next: (users) => {
                this.selectedOrgUsers = users;
            },
            error: (error) => {
                console.error("Failed to load users:", error);
            }
        });

        this.detailsModalVisible = true;
    }

    // Helper methods for organization display
    getPlanBadgeColor(planType: string): string {
        switch (planType) {
            case 'FREE': return 'secondary';
            case 'SMALL_COMPANY': return 'primary';
            case 'ENTERPRISE': return 'success';
            default: return 'info';
        }
    }

    getPlanTeamLimit(planType: string): number {
        switch (planType) {
            case 'FREE': return 1;
            case 'SMALL_COMPANY': return 5;
            case 'ENTERPRISE': return 999999;
            default: return 0;
        }
    }

    getPlanRepoLimit(planType: string): number {
        switch (planType) {
            case 'FREE': return 5;
            case 'SMALL_COMPANY': return 10;
            case 'ENTERPRISE': return 999999;
            default: return 0;
        }
    }

    // Run Mode management
    changeRunMode(mode: string) {
        this.appRunMode = mode;
    }

    saveRunMode() {
        this.appConfigService.setRunMode(this.appRunMode).subscribe({
            next: () => {
                this.toastStatus = "success";
                this.toastMessage = "Application run mode updated successfully";
                this.toggleToast();
            },
            error: (error) => {
                this.toastStatus = "danger";
                this.toastMessage = "Failed to update run mode";
                this.toggleToast();
            }
        });
    }

    saveOtherConfigurationSettings() {
        this.settingsService.changeOtherConfig({
            geminiApiKey: this.geminiApiKey
        }).subscribe({
            next: () => {
                this.toastStatus = "success";
                this.toastMessage = "Application configuration updated successfully";
                this.toggleToast();
            },
            error: (error) => {
                this.toastStatus = "danger";
                this.toastMessage = "Failed to update";
                this.toggleToast();
            }
        });
    }
}
