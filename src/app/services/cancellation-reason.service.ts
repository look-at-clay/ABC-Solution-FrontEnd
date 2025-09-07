import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CancellationReason, CreateCancellationReasonRequest, UpdateCancellationReasonRequest } from '../models/cancellation-reason.model';

@Injectable({
  providedIn: 'root'
})
export class CancellationReasonService {
  private baseUrl = `${environment.baseUrl}/admin/v1/cancellationReason`;

  constructor(private http: HttpClient) {}

  // Get all cancellation reasons
  getAllCancellationReasons(): Observable<CancellationReason[]> {
    return this.http.get<CancellationReason[]>(`${this.baseUrl}/getAll`);
  }

  // Get cancellation reason by ID
  getCancellationReasonById(id: number): Observable<CancellationReason> {
    return this.http.get<CancellationReason>(`${this.baseUrl}/getById/${id}`);
  }

  // Create new cancellation reason
  createCancellationReason(request: CreateCancellationReasonRequest): Observable<CancellationReason> {
    return this.http.post<CancellationReason>(`${this.baseUrl}/create`, request);
  }

  // Update cancellation reason by ID
  updateCancellationReason(id: number, request: UpdateCancellationReasonRequest): Observable<CancellationReason> {
    return this.http.put<CancellationReason>(`${this.baseUrl}/updateById/${id}`, request);
  }

  // Delete cancellation reason by ID
  deleteCancellationReason(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteById/${id}`);
  }
}