import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";


@Injectable({
    providedIn: 'root'
})
export class ComponentsService {
    private loginUrl = environment.backendUrl;


    constructor(private http: HttpClient) {}

    getComponents(): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/components',{ withCredentials: true });
    }

}
