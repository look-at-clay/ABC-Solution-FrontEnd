import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReportsStatsResponse } from '../models/reports-stats.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsStatsService {
  private baseUrl = `${environment.baseUrl}/admin/v1`;

  constructor(private http: HttpClient) {}

  getProductTradingStats(fromDate: string, toDate: string): Observable<ReportsStatsResponse> {
    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate);

    return this.http.get<ReportsStatsResponse>(`${this.baseUrl}/by-products`, { params });
  }
}