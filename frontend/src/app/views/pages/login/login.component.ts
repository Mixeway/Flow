import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {AuthService} from "../../../service/AuthService";
import {
    ButtonDirective,
    CardBodyComponent,
    CardComponent,
    CardGroupComponent,
    ColComponent,
    ContainerComponent, FormControlDirective,
    InputGroupComponent, InputGroupTextDirective,
    RowComponent
} from "@coreui/angular";
import * as jwt_decode from 'jwt-decode';

import {IconDirective} from "@coreui/icons-angular";
import {getNavItems, navItems} from "../../../layout/default-layout/_nav";

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
        ButtonDirective
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
    loginForm: FormGroup;
    password: boolean = true;
    sso: boolean = false;

    constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }


    onSubmit() {
        if (this.loginForm.valid) {
            const { username, password } = this.loginForm.value;
            this.authService.login({ username, password }).subscribe({
                next: (response) => {


                    if (response.resetPassword === true) {
                        const payloadBase64 = response.accessToken.split('.')[1];
                        const decodedPayload = atob(payloadBase64);

                        // Parse the JSON string
                        const payloadObject = JSON.parse(decodedPayload);

                        // Access the role
                        const userRole = payloadObject.roles; // Assuming roles is an array and you need the first role
                        localStorage.setItem('userRole', userRole); // Store the role in localStorage

                        // Reinitialize the navItems
                        navItems.length = 0; // Clear existing items
                        navItems.push(...getNavItems()); // Push updated items
                        this.router.navigate(['/change']);
                    } else {
                        const payloadBase64 = response.accessToken.split('.')[1];
                        const decodedPayload = atob(payloadBase64);

                        // Parse the JSON string
                        const payloadObject = JSON.parse(decodedPayload);

                        // Access the role
                        const userRole = payloadObject.roles; // Assuming roles is an array and you need the first role
                        localStorage.setItem('userRole', userRole); // Store the role in localStorage

                        // Reinitialize the navItems
                        navItems.length = 0; // Clear existing items
                        navItems.push(...getNavItems()); // Push updated items
                        this.router.navigate(['/dashboard']);
                    }
                },
                error: (error) => {
                    // Handle login error
                }
            });
        }
    }
    ngOnInit() {
        this.getStatus();
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
                if (response.status === 'prodsso' || response.status === 'devsso'){
                    this.password = false;
                    this.sso = true;
                }
            },
            error: () => {
                // Health check failed, stay on login page
            }
        });
    }
    redirectToSSO(): void {
        window.location.href = '/oauth2/authorization/sso';
    }

}