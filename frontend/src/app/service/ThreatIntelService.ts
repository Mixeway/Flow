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

}
