import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Configuration, ConfigurationUpdateRequest } from '../models/configuration.model';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private baseUrl = `${environment.baseUrl}/api/configurations`;

  constructor(private http: HttpClient) {}

  getAllConfigurations(): Observable<Configuration[]> {
    return this.http.get<Configuration[]>(this.baseUrl);
  }

  getConfigurationById(id: number): Observable<Configuration> {
    return this.http.get<Configuration>(`${this.baseUrl}/${id}`);
  }

  updateConfiguration(id: number, config: ConfigurationUpdateRequest): Observable<Configuration> {
    return this.http.put<Configuration>(`${this.baseUrl}/${id}`, config);
  }
}