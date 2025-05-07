// organization.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OrganizationService {
    private baseUrl = '/api/v1/admin/organizations';

    constructor(private http: HttpClient) { }

    getAllOrganizations(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}`);
    }

    getOrganization(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/${id}`);
    }

    createOrganization(organization: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}`, organization);
    }

    updateOrganization(organization: any): Observable<any> {
        return this.http.put<any>(`${this.baseUrl}/${organization.id}`, organization);
    }

    deleteOrganization(id: number): Observable<any> {
        return this.http.delete<any>(`${this.baseUrl}/${id}`);
    }

    getOrganizationTeams(id: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/${id}/teams`);
    }

    getOrganizationUsers(id: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/${id}/users`);
    }

    getOrganizationAdmin(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/${id}/admin`);
    }
}