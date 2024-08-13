import { Component } from '@angular/core';
import {
    ButtonDirective,
    CardBodyComponent,
    CardComponent, CardGroupComponent,
    ColComponent,
    ContainerComponent, FormControlDirective, FormDirective, FormFeedbackComponent, InputGroupComponent,
    InputGroupTextDirective, ProgressComponent,
    RowComponent, ToastBodyComponent, ToastComponent, ToasterComponent, ToastHeaderComponent
} from "@coreui/angular";
import {IconDirective} from "@coreui/icons-angular";
import {FormBuilder, FormGroup, FormsModule, NgForm, NgModel, Validators} from "@angular/forms";
import {AuthService} from "../../../service/AuthService";
import {Route, Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {getNavItems, navItems} from "../../../layout/default-layout/_nav";

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
export class ChangePasswordComponent {
    newPassword: string = "";
    confirmPassword: string = "";
    submitted = false;
    passwordMismatch = false;
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

    onTimerChange($event: number) {
        this.percentage = $event * 25;
    }

    constructor(private authService: AuthService, private router: Router) {}

    onChangePassword(form: NgForm) {
        this.submitted = true;
        this.passwordMismatch = this.newPassword !== this.confirmPassword;

        if (form.valid && !this.passwordMismatch) {
            const changePasswordData = {
                password: this.newPassword,
                passwordRepeat: this.confirmPassword,
            };
            this.authService.changePassword(changePasswordData).subscribe(
                response => {
                    this.toastStatus = "success";
                    this.toastMessage = "Password changed successfully"
                    this.toggleToast();

                    this.router.navigate(['/dashboard']);
                    // Handle success response
                },
                error => {
                    this.toastStatus = "danger";
                    this.toastMessage = "Password must be at least 8 char long. Make sure both passwords are matching"
                    this.toggleToast();
                    // Handle error response
                }
            );
        } else {
            this.toastStatus = "danger";
            this.toastMessage = "Password must be at least 8 char long. Make sure both passwords are matching"
            this.toggleToast();
        }
    }

    isFieldInvalid(field: NgModel): boolean {
        return !!(field.invalid && (field.dirty || field.touched || this.submitted));
    }
}
