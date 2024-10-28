import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})
export class ThreatIntelService {
    private loginUrl = environment.backendUrl;


    constructor(private http: HttpClient) {}

    getThreats(): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/threat-intel/findings',{ withCredentials: true });
    }

    getTopRemoved(): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/threat-intel/removed',{ withCredentials: true });
    }

    getTopReviewed(): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/threat-intel/supressed',{ withCredentials: true });
    }

    getSuppressRules(): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/threat-intel/suppress-rules',{ withCredentials: true });
    }

    createRule(rule: any): Observable<any> {
        return this.http.post<any>(this.loginUrl + '/api/v1/threat-intel/suppress-rules', rule,{ withCredentials: true });
    }

    deleteRule(id: any): Observable<any> {
        return this.http.delete<any>(this.loginUrl + '/api/v1/threat-intel/suppress-rules/'+id,{ withCredentials: true });
    }

}
