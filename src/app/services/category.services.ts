import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  productCount: number;
}

export interface CreateCategoryRequest {
  name: string;
}

export interface UpdateCategoryRequest {
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = `${environment.baseUrl}/api/admin/categories`;

  constructor(private http: HttpClient) {}

  // Get all categories
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/getAllCategories`);
  }

  // Get category by ID
  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/categories/${id}`);
  }

  // Add new category
  addCategory(request: CreateCategoryRequest): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/addCategory`, request);
  }

  // Update category
  updateCategory(id: number, request: UpdateCategoryRequest): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/updateCategory/${id}`, request);
  }

  // Delete category
  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/categories/${id}`);
  }

  // Assign product to category
  assignProductToCategory(categoryId: number, productId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/assignProduct/${categoryId}/product/${productId}`, {});
  }
}