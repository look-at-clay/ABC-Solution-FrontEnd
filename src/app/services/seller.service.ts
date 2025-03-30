import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SellerService {
  private baseUrl = `${environment.baseUrl}/api/v1/seller`;

  constructor(private http: HttpClient) {}

  getAllSellers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/getAllSellers`);
  }

  getSellerProducts(sellerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getProducts/${sellerId}`);
  }
}