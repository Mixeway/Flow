import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private loginUrl = environment.backendUrl;

    constructor(private http: HttpClient) {}

    login(credentials: { username: string; password: string }): Observable<any> {
        return this.http.post<any>(this.loginUrl + '/api/v1/login', credentials, { withCredentials: true });
    }
    hc(): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/hc',{ withCredentials: true });
    }
    status(): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/status');
    }
    hcAdmin(): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/hc/admin',{ withCredentials: true });
    }
    hcTeamManager(): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/hc/tm',{ withCredentials: true });
    }
    changePassword(passwordData: { password: string; passwordRepeat: string }): Observable<any> {
        return this.http.post<any>(this.loginUrl + '/api/v1/change-password', passwordData, { withCredentials: true });
    }


}
