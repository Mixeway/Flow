import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function gitRepoUrlValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const url = control.value;
        try {
            const parsedUrl = new URL(url);

            // Check if the URL has a host and a path
            if (parsedUrl.host && parsedUrl.pathname && parsedUrl.pathname !== '/') {
                // Optional: Further validation to check if the URL has a port
                return null;
            } else {
                return { invalidGitRepoUrl: true };
            }
        } catch (e) {
            return { invalidGitRepoUrl: true };
        }
    };
}
