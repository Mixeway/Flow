import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from "../../../service/AuthService";
import {
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardGroupComponent,
    ColComponent,
    ContainerComponent,
    FormControlDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    RowComponent,
    AlertComponent
} from "@coreui/angular";
import {IconComponent, IconDirective, IconSetService} from "@coreui/icons-angular";
import { getNavItems, navItems } from "../../../layout/default-layout/_nav";
import { finalize } from 'rxjs/operators';
import {brandSet, freeSet} from "@coreui/icons";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputGroupComponent,
        ContainerComponent,
        RowComponent,
        ColComponent,
        CardGroupComponent,
        CardComponent,
        CardBodyComponent,
        FormControlDirective,
        InputGroupTextDirective,
        IconDirective,
        ButtonDirective,
        AlertComponent,
        IconComponent
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    password: boolean = true;
    sso: boolean = false;
    mode: string = "STANDALONE";
    isLoading: boolean = false;
    loginError: string | null = null;
    showPassword: boolean = false;
    darkMode: boolean = false;

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,public iconSet: IconSetService) {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required],
            rememberMe: [false]
        });
        iconSet.icons = {...freeSet, ...iconSet, ...brandSet};
        // Check for system dark mode preference
        this.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Check for saved dark mode preference
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode) {
            this.darkMode = savedDarkMode === 'true';
        }
    }

    ngOnInit() {
        this.getStatus();
        this.performHealthCheck();
    }

    performHealthCheck() {
        this.authService.hc().subscribe({
            next: () => {
                this.router.navigate(['/dashboard']);
            },
            error: () => {
                // Health check failed, stay on login page
            }
        });
    }

    getStatus() {
        this.authService.status().subscribe({
            next: (response) => {
                this.mode = response.mode;
                if (response.status === 'prodsso' || response.status === 'devsso') {
                    this.password = false;
                    this.sso = true;

                }
            },
            error: () => {
                // Status check failed, default to password login
                this.password = true;
                this.sso = false;
            }
        });
    }

    onSubmit() {
        this.loginError = null;

        if (this.loginForm.valid) {
            this.isLoading = true;
            const { username, password, rememberMe } = this.loginForm.value;

            this.authService.login({ username, password, rememberMe })
                .pipe(finalize(() => this.isLoading = false))
                .subscribe({
                    next: (response) => {
                        this.handleLoginSuccess(response);
                    },
                    error: (error) => {
                        this.handleLoginError(error);
                    }
                });
        } else {
            this.loginForm.markAllAsTouched();
        }
    }

    handleLoginSuccess(response: any) {
        try {
            // Get the payload from the token
            const payloadBase64 = response.accessToken.split('.')[1];
            const decodedPayload = atob(payloadBase64);
            const payloadObject = JSON.parse(decodedPayload);

            // Store user role
            const userRole = payloadObject.roles;
            localStorage.setItem('userRole', userRole);

            // Reinitialize navigation
            navItems.length = 0;
            navItems.push(...getNavItems());

            // Redirect based on password reset status
            if (response.resetPassword === true) {
                this.router.navigate(['/change']);
            } else {
                this.router.navigate(['/dashboard']);
            }
        } catch (error) {
            console.error('Error processing login response:', error);
            this.loginError = 'An unexpected error occurred. Please try again.';
        }
    }

    handleLoginError(error: any) {
        if (error.status === 401) {
            this.loginError = 'Invalid username or password. Please try again.';
        } else if (error.status === 429) {
            this.loginError = 'Too many login attempts. Please try again later.';
        } else {
            this.loginError = 'An error occurred. Please try again later.';
        }
        console.error('Login error:', error);
    }

    redirectToSSO(): void {
        this.isLoading = true;
        // Short timeout to show loading state before redirect
        setTimeout(() => {
            window.location.href = '/oauth2/authorization/sso';
        }, 300);
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    toggleDarkMode(): void {
        this.darkMode = !this.darkMode;
        localStorage.setItem('darkMode', this.darkMode.toString());
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.loginForm.get(fieldName);
        return field ? field.invalid && (field.dirty || field.touched) : false;
    }
}