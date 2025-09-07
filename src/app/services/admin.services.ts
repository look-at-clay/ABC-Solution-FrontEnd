// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';
import { UserLevelStats } from '../models/user-stats.mode';
import { OrderStatistics } from '../models/order-stat.model';
import { CombinedRequestStats } from '../models/request-stats.model';
import { AdminUser } from '../models/adminuser.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = `${environment.baseUrl}/admin/v1`;

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<AdminUser[]> {
    return this.http.get<AdminUser[]>(`${this.baseUrl}/getAllUsers`);
  }

  getUserLevelStats(): Observable<UserLevelStats> {
    return this.http.get<UserLevelStats>(`${this.baseUrl}/user-level-stats`);
  }

  getOrderStatistics(): Observable<OrderStatistics> {
    return this.http.get<OrderStatistics>(`${this.baseUrl}/order-statistics`);
  }

  getCombinedRequestStats(): Observable<CombinedRequestStats> {
  return this.http.get<CombinedRequestStats>(`${this.baseUrl}/buyerseller-combined-request-statistics`);
}

  getBuyerCount(): Observable<number> {
    return this.http.get<number>(`${environment.baseUrl}/api/v1/buyer/getBuyerCount`);
  }

  getSellerCount(): Observable<number> {
    return this.http.get<number>(`${environment.baseUrl}/api/v1/seller/getSellerCount`);
  }

  // Product trading statistics methods
  getProductTotalAmount(productId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/delivered/total-amount/${productId}`);
  }

  getProductTotalVolume(productId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/delivered/total-volume/${productId}`);
  }

  // User block/unblock methods
  blockUser(userId: number): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}/api/users/${userId}/block`, {});
  }

  unblockUser(userId: number): Observable<any> {
    return this.http.put<any>(`${environment.baseUrl}/api/users/${userId}/unblock`, {});
  }

  // Wallet methods
  addAmountToWallet(userId: number, amount: number): Observable<any> {
    return this.http.post<any>(`${environment.baseUrl}/api/wallet/${userId}/add?amount=${amount}`, {});
  }
}