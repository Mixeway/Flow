import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    private loginUrl = environment.backendUrl;

    constructor(private http: HttpClient) {}

    changeSca(scaConfig: any): Observable<any> {
        return this.http.post<any>(this.loginUrl + '/api/v1/admin/settings/scaconfig', scaConfig, { withCredentials: true });
    }
    changeSmtp(smtpConfig: any): Observable<any> {
        return this.http.post<any>(this.loginUrl + '/api/v1/admin/settings/smtpconfig', smtpConfig, { withCredentials: true });
    }
    get(): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/admin/settings', {withCredentials: true});
    }
    changeWiz(wizConfig: any): Observable<any> {
        return this.http.post<any>(`${this.loginUrl}/api/v1/admin/settings/wizconfig`, wizConfig, { withCredentials: true });
    }

    getAdditionalScannerConfig(): Observable<any> {
        return this.http.get<any>(`${this.loginUrl}/api/v1/admin/settings/additionalscannerconfig`, { withCredentials: true });
    }
}
