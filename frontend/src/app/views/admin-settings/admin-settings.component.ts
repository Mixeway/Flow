import {Component, OnInit} from '@angular/core';
import {
    AccordionButtonDirective,
    AccordionComponent,
    AccordionItemComponent,
    AlertComponent,
    BadgeComponent,
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardHeaderComponent,
    ColComponent,
    FormCheckComponent,
    FormCheckInputDirective,
    FormCheckLabelDirective,
    FormControlDirective,
    FormDirective,
    FormFeedbackComponent,
    FormLabelDirective,
    FormSelectDirective,
    FormTextDirective,
    GutterDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    ListGroupDirective,
    ListGroupItemDirective,
    ProgressComponent,
    RowComponent,
    RowDirective,
    SpinnerComponent,
    TabDirective,
    TabPanelComponent,
    TabsComponent,
    TabsContentComponent,
    TabsListComponent,
    TemplateIdDirective,
    ToastBodyComponent,
    ToastComponent, ToasterComponent,
    ToastHeaderComponent,
    TooltipDirective,
    WidgetStatCComponent
} from "@coreui/angular";
import {ChartjsComponent} from "@coreui/angular-chartjs";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {IconComponent, IconDirective} from "@coreui/icons-angular";
import {NgxDatatableModule} from "@swimlane/ngx-datatable";
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {map, startWith} from "rxjs/operators";
import {of} from "rxjs";
import {AuthService} from "../../service/AuthService";
import {SettingsService} from "../../service/SettingsService";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-settings',
  standalone: true,
    imports: [
        AccordionButtonDirective,
        AccordionComponent,
        AccordionItemComponent,
        AlertComponent,
        BadgeComponent,
        CardBodyComponent,
        CardComponent,
        CardHeaderComponent,
        ChartjsComponent,
        ColComponent,
        DatePipe,
        FormCheckComponent,
        FormCheckInputDirective,
        FormCheckLabelDirective,
        FormLabelDirective,
        FormSelectDirective,
        IconComponent,
        IconDirective,
        InputGroupComponent,
        InputGroupTextDirective,
        ListGroupDirective,
        ListGroupItemDirective,
        NgForOf,
        NgIf,
        NgxDatatableModule,
        ProgressComponent,
        ReactiveFormsModule,
        RowComponent,
        SpinnerComponent,
        TabDirective,
        TabPanelComponent,
        TabsComponent,
        TabsContentComponent,
        TabsListComponent,
        TemplateIdDirective,
        WidgetStatCComponent,
        FormFeedbackComponent,
        FormControlDirective,
        GutterDirective,
        FormDirective,
        RowDirective,
        FormsModule,
        TooltipDirective,
        FormTextDirective,
        ButtonDirective,
        ToastBodyComponent,
        ToastComponent,
        ToastHeaderComponent,
        ToasterComponent
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

    settings: any;

    // For Authentication Tab
    authType: string = 'userPass';

    constructor(private fb: FormBuilder, private authService: AuthService, private settingsService: SettingsService,
                private router: Router) {
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

}
