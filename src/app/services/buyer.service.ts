import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BuyerService {
  private baseUrl = `${environment.baseUrl}/api/v1/buyer`;

  constructor(private http: HttpClient) {}

  getAllBuyers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/getAllBuyers`);
  }

  getBuyerProducts(buyerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getProducts/${buyerId}`);
  }
}