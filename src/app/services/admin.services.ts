// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { UserLevelStats } from '../models/user-stats.mode';
import { OrderStatistics } from '../models/order-stat.model';
import { CombinedRequestStats } from '../models/request-stats.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = `${environment.baseUrl}/admin/v1`;

  constructor(private http: HttpClient) {}

  getUserLevelStats(): Observable<UserLevelStats> {
    return this.http.get<UserLevelStats>(`${this.baseUrl}/user-level-stats`);
  }

  getOrderStatistics(): Observable<OrderStatistics> {
    return this.http.get<OrderStatistics>(`${this.baseUrl}/order-statistics`);
  }

  getCombinedRequestStats(): Observable<CombinedRequestStats> {
  return this.http.get<CombinedRequestStats>(`${this.baseUrl}/buyerseller-combined-request-statistics`);
}
}