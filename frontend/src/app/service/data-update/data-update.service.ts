import {Injectable, signal} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {DataUpdateLog} from "../../model/data-update-log";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataUpdateService {

  private loginUrl = environment.backendUrl;
  private _logs = signal<DataUpdateLog[]>([]);

  readonly logs = this._logs.asReadonly();

  setLogs(logs: DataUpdateLog[]): void {
    this._logs.set(logs);
  }

  constructor(private http: HttpClient) {}

  loadDataLogs(): void {
    this.http.get<any>(this.loginUrl + '/api/v1/downloader/log',{ withCredentials: true }).subscribe({
      next: (response) => {
        this.setLogs(response);
      },
      error: (error) => {
        // Handle error
        console.error('Error loading code repos:', error);
      }
    });
  }

  uploadData(data: any): Observable<string> {
    return this.http.post<any>(this.loginUrl + '/api/v1/downloader/update', data, { withCredentials: true });
  }

  downloadFile(id: string) {
    return this.http.get(
        `${this.loginUrl}/api/v1/downloader/file?id=${id}`,
        { withCredentials: true, responseType: 'blob' }
    );
  }
}
