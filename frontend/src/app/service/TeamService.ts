import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

interface TeamDto {
    name: string;
    users: number[];
}
interface ChangeTeamDto {
    id: number;
    users: number[];
}
@Injectable({
    providedIn: 'root'
})
export class TeamService {
    private loginUrl = environment.backendUrl;


    constructor(private http: HttpClient) {}

    create(team: TeamDto): Observable<any> {
        return this.http.post<any>(this.loginUrl + '/api/v1/team/create', team, { withCredentials: true });
    }
    get(): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/team',{ withCredentials: true });
    }

    getTeam(id: string): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/team/' + id ,{ withCredentials: true });
    }
    update(change: ChangeTeamDto): Observable<any> {
        return this.http.post<any>(this.loginUrl + '/api/v1/team', change, { withCredentials: true });
    }


}
