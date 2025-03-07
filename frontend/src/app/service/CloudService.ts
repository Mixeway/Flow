import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../environments/environment";

interface CloudSubscription {
    id: number;
    name: string;
    team: string;
    externalProjectName: string;
    cloudSubscription: string;
    scanStatus: string;
}

@Injectable({
    providedIn: 'root'
})
export class CloudService {
    private loginUrl = environment.backendUrl;

    constructor(private http: HttpClient) {}

    getCloudSubscriptions(): Observable<CloudSubscription[]> {
        return this.http.get<CloudSubscription[]>(this.loginUrl + '/api/v1/cloudsubscription/cloudsubscriptions', { withCredentials: true });
    }

    getAggregatedStats(): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/widget_stats', { withCredentials: true });
    }

}
