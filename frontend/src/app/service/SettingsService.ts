import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from "../../environments/environment";
import {map} from "rxjs/operators";
import {OtherConfigRequestDTO} from "../model/settings/other-config-request-dto";

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
    changeOtherConfig(changeOtherConfigRequest: OtherConfigRequestDTO): Observable<any> {
        return this.http.post<any>(`${this.loginUrl}/api/v1/admin/settings/other`, changeOtherConfigRequest, { withCredentials: true });
    }

    isWizEnabled(): Observable<boolean> {
        return this.http.get<any>(`${this.loginUrl}/api/v1/admin/settings`, { withCredentials: true }).pipe(
            map(settings => settings.wizConfig?.enabled ?? false)
        );
    }

    getAdditionalScannerConfig(): Observable<any> {
        return this.http.get<any>(`${this.loginUrl}/api/v1/admin/settings/additionalscannerconfig`, { withCredentials: true });
    }
}
