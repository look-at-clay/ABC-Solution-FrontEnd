import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = `${environment.baseUrl}/api/admin/products`;

  constructor(private http: HttpClient) {}

  addProduct(product: Product): Observable<any> {
    return this.http.post(`${this.baseUrl}/addProduct`, product);
  }

  getAllProducts(): Observable<any>{
    return this.http.get(`${this.baseUrl}/getAllProducts`);
  }

  updateProduct(id: any, product: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/updateProduct/${id}`, product);
  }

  getProductById(id: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/products/${id}`);
  }
}
