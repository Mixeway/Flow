import {Component, OnInit} from '@angular/core';
import {
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    ColComponent,
    RowComponent,
    TabDirective,
    TabPanelComponent,
    TabsComponent,
    TabsContentComponent,
    TabsListComponent,
    ToastBodyComponent,
    ToastComponent,
    ToasterComponent,
    ToastHeaderComponent,
    AlertComponent
} from "@coreui/angular";
import {NgIf} from "@angular/common";
import {IconDirective} from "@coreui/icons-angular";
import {AuthService} from "../../service/AuthService";
import {Router} from "@angular/router";
import {UserService} from "../../service/UserService";

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        CardBodyComponent,
        CardComponent,
        ColComponent,
        IconDirective,
        NgIf,
        RowComponent,
        TabDirective,
        TabPanelComponent,
        TabsComponent,
        TabsContentComponent,
        TabsListComponent,
        ButtonDirective,
        ToastBodyComponent,
        ToastComponent,
        ToastHeaderComponent,
        ToasterComponent,
        AlertComponent
    ],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
    apiKey: string | null = null;
    apiKeyGenerated = false;
    generating = false;

    position = 'top-end';
    visible = false;
    toastMessage = '';
    toastStatus = '';

    constructor(
        private authService: AuthService,
        private router: Router,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.authService.hc().subscribe({
            error: () => {
                this.router.navigate(['/login']);
            }
        });
    }

    generateApiKey() {
        this.generating = true;
        this.userService.generateApiKey().subscribe({
            next: (response) => {
                this.apiKey = response.status;
                this.apiKeyGenerated = true;
                this.generating = false;
                this.toastStatus = 'success';
                this.toastMessage = 'API key generated successfully';
                this.toggleToast();
            },
            error: () => {
                this.generating = false;
                this.toastStatus = 'danger';
                this.toastMessage = 'Failed to generate API key';
                this.toggleToast();
            }
        });
    }

    copyToClipboard() {
        if (this.apiKey) {
            navigator.clipboard.writeText(this.apiKey).then(() => {
                this.toastStatus = 'success';
                this.toastMessage = 'API key copied to clipboard';
                this.toggleToast();
            });
        }
    }

    toggleToast() {
        this.visible = !this.visible;
    }

    onVisibleChange($event: boolean) {
        this.visible = $event;
    }
}
