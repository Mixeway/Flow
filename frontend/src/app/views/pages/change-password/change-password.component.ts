import { Component, OnInit, OnDestroy } from '@angular/core';
import {
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardGroupComponent,
    ColComponent,
    ContainerComponent,
    FormControlDirective,
    FormDirective,
    FormFeedbackComponent,
    InputGroupComponent,
    InputGroupTextDirective,
    ProgressComponent,
    RowComponent,
    ToastBodyComponent,
    ToastComponent,
    ToasterComponent,
    ToastHeaderComponent
} from "@coreui/angular";
import { IconDirective } from "@coreui/icons-angular";
import { FormsModule, NgForm, NgModel } from "@angular/forms";
import { AuthService } from "../../../service/AuthService";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { getNavItems, navItems } from "../../../layout/default-layout/_nav";
import { finalize } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-change-password',
    standalone: true,
    imports: [
        RowComponent,
        ColComponent,
        CardComponent,
        CardBodyComponent,
        ContainerComponent,
        InputGroupTextDirective,
        IconDirective,
        FormControlDirective,
        InputGroupComponent,
        CardGroupComponent,
        ButtonDirective,
        FormDirective,
        FormsModule,
        FormFeedbackComponent,
        CommonModule,
        ToasterComponent,
        ToastComponent,
        ToastHeaderComponent,
        ToastBodyComponent,
        ProgressComponent
    ],
    templateUrl: './change-password.component.html',
    styleUrl: './change-password.component.scss'
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
    // Form fields
    newPassword: string = "";
    confirmPassword: string = "";

    // Form states
    submitted = false;
    passwordMismatch = false;
    isLoading = false;

    // Password visibility toggles
    showNewPassword = false;
    showConfirmPassword = false;

    // Toast notification states
    visible = false;
    toastMessage: string = "";
    toastStatus: string = "";
    toastProgress: number = 0;
    toastTimer: any;

    // Password strength indicators
    passwordStrength = 0;
    passwordStrengthText = '';

    // Password requirement checks
    hasMinLength = false;

    // Dark mode state
    darkMode = false;

    // Subscriptions
    private toastSubscription?: Subscription;

    constructor(private authService: AuthService, private router: Router) {}

    ngOnInit() {
        // Check for system dark mode preference
        this.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Check for saved dark mode preference
        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode) {
            this.darkMode = savedDarkMode === 'true';
        }
    }

    ngOnDestroy() {
        // Clear any active toast timers
        if (this.toastTimer) {
            clearInterval(this.toastTimer);
        }

        // Unsubscribe from any active subscriptions
        if (this.toastSubscription) {
            this.toastSubscription.unsubscribe();
        }
    }

    // Toggle visibility of password fields
    toggleNewPasswordVisibility(): void {
        this.showNewPassword = !this.showNewPassword;
    }

    toggleConfirmPasswordVisibility(): void {
        this.showConfirmPassword = !this.showConfirmPassword;
    }

    // Toggle dark mode
    toggleDarkMode(): void {
        this.darkMode = !this.darkMode;
        localStorage.setItem('darkMode', this.darkMode.toString());
    }

    // Check password strength and requirements
    checkPasswordStrength(): void {
        const password = this.newPassword;

        // Check only the length requirement
        this.hasMinLength = password.length >= 8;

        // Calculate strength score (0-5) based only on length
        let strengthScore = 0;

        if (password.length > 0) {
            // Calculate strength based on length only
            if (password.length >= 1) strengthScore = 1;  // Any character
            if (password.length >= 4) strengthScore = 2;  // 4+ characters
            if (password.length >= 6) strengthScore = 3;  // 6+ characters
            if (password.length >= 8) strengthScore = 4;  // 8+ characters (minimum requirement)
            if (password.length >= 12) strengthScore = 5; // 12+ characters (extra strong)
        }

        this.passwordStrength = strengthScore;

        // Set strength text
        switch (strengthScore) {
            case 0: this.passwordStrengthText = ''; break;
            case 1: this.passwordStrengthText = 'Weak'; break;
            case 2: this.passwordStrengthText = 'Fair'; break;
            case 3: this.passwordStrengthText = 'Good'; break;
            case 4: this.passwordStrengthText = 'Strong'; break;
            case 5: this.passwordStrengthText = 'Very Strong'; break;
        }
    }

    // Form submission handler
    onChangePassword(form: NgForm) {
        this.submitted = true;
        this.passwordMismatch = this.newPassword !== this.confirmPassword;
        this.checkPasswordStrength();

        if (form.valid && !this.passwordMismatch) {
            this.isLoading = true;

            const changePasswordData = {
                password: this.newPassword,
                passwordRepeat: this.confirmPassword,
            };

            this.authService.changePassword(changePasswordData)
                .pipe(finalize(() => this.isLoading = false))
                .subscribe({
                    next: response => {
                        this.showToast('success', 'Password changed successfully. Redirecting to dashboard...');

                        // Redirect after successful password change with a slight delay
                        setTimeout(() => {
                            this.router.navigate(['/dashboard']);
                        }, 2000);
                    },
                    error: error => {
                        if (error.status === 400) {
                            this.showToast('danger', 'Password does not meet the requirements. Please check and try again.');
                        } else {
                            this.showToast('danger', 'An error occurred. Please try again later.');
                        }
                    }
                });
        } else {
            if (this.passwordMismatch) {
                this.showToast('danger', 'Passwords do not match. Please check and try again.');
            } else {
                this.showToast('danger', 'Please fix the errors in the form and try again.');
            }
        }
    }

    // Toast notification handlers
    showToast(status: string, message: string): void {
        this.toastStatus = status;
        this.toastMessage = message;
        this.visible = true;
        this.toastProgress = 0;

        // Clear any existing timer
        if (this.toastTimer) {
            clearInterval(this.toastTimer);
        }

        // Start the progress timer
        const duration = 5000; // 5 seconds
        const interval = 50; // Update every 50ms
        const steps = duration / interval;
        let step = 0;

        this.toastTimer = setInterval(() => {
            step++;
            this.toastProgress = (step / steps) * 100;

            if (step >= steps) {
                this.visible = false;
                clearInterval(this.toastTimer);
            }
        }, interval);
    }

    toggleToast(): void {
        this.visible = !this.visible;

        if (!this.visible && this.toastTimer) {
            clearInterval(this.toastTimer);
        }
    }

    onVisibleChange(isVisible: boolean): void {
        this.visible = isVisible;

        if (!isVisible && this.toastTimer) {
            clearInterval(this.toastTimer);
        }
    }

    // Validation helper
    isFieldInvalid(field: NgModel): boolean {
        return !!(field.invalid && (field.dirty || field.touched || this.submitted));
    }
}