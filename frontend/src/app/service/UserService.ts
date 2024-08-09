import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../environments/environment";

interface UserDto {
    username: string;
    password: string;
    role: string;
    teams: number[];
}
@Injectable({
    providedIn: 'root'
})
export class UserService {
    private loginUrl = environment.backendUrl;


    constructor(private http: HttpClient) {}

    get(): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/users',{ withCredentials: true });
    }
    create(user: UserDto): Observable<any> {
        return this.http.post<any>(this.loginUrl + '/api/v1/user/create',user,{ withCredentials: true });
    }
    changeRole(role: {role: string}, id: number): Observable<any> {
        return this.http.post<any>(this.loginUrl + '/api/v1/user/' +id + '/change/role',role,{ withCredentials: true });
    }
    changeTeam(teams: {teams: number[]}, id: number): Observable<any> {
        return this.http.post<any>(this.loginUrl + '/api/v1/user/' +id + '/change/team',teams,{ withCredentials: true });
    }
    changePassword(password: {password: string}, id: number): Observable<any> {
        return this.http.post<any>(this.loginUrl + '/api/v1/user/' +id + '/change/password',password,{ withCredentials: true });
    }
    deactivate( id: number): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/user/' +id + '/deactivate',{ withCredentials: true });
    }
    activate( id: number): Observable<any> {
        return this.http.get<any>(this.loginUrl + '/api/v1/user/' +id + '/activate',{ withCredentials: true });
    }

}
