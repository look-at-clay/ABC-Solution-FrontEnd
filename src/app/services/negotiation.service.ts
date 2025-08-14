import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  NegotiationCategory,
  NegotiationQuestion,
  NegotiationResponse,
  CreateCategoryRequest,
  CreateQuestionRequest,
  CreateResponseRequest
} from '../models/negotiation.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NegotiationService {
  private apiUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  // Categories APIs
  getCategories(): Observable<NegotiationCategory[]> {
    return this.http.get<NegotiationCategory[]>(`${this.apiUrl}/api/negotiation-config/admin/categories`);
  }

  createCategory(category: CreateCategoryRequest): Observable<NegotiationCategory> {
    return this.http.post<NegotiationCategory>(`${this.apiUrl}/api/negotiation-config/categories`, category);
  }

  updateCategory(id: number, category: CreateCategoryRequest): Observable<NegotiationCategory> {
    return this.http.put<NegotiationCategory>(`${this.apiUrl}/api/negotiation-config/categories/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/negotiation-config/categories/${id}`);
  }

  // Questions APIs
  getQuestionsByCategory(categoryId: number): Observable<NegotiationQuestion[]> {
    return this.http.get<NegotiationQuestion[]>(`${this.apiUrl}/api/negotiation-config/admin/categories/${categoryId}/questions`);
  }

  createQuestion(question: CreateQuestionRequest): Observable<NegotiationQuestion> {
    return this.http.post<NegotiationQuestion>(`${this.apiUrl}/api/negotiation-config/questions`, question);
  }

  updateQuestion(id: number, question: CreateQuestionRequest): Observable<NegotiationQuestion> {
    return this.http.put<NegotiationQuestion>(`${this.apiUrl}/api/negotiation-config/questions/${id}`, question);
  }

  deleteQuestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/negotiation-config/questions/${id}`);
  }

  // Responses APIs
  getResponsesByQuestion(questionId: number): Observable<NegotiationResponse[]> {
    return this.http.get<NegotiationResponse[]>(`${this.apiUrl}/api/negotiation-config/admin/questions/${questionId}/responses`);
  }

  createResponse(response: CreateResponseRequest): Observable<NegotiationResponse> {
    return this.http.post<NegotiationResponse>(`${this.apiUrl}/api/negotiation-config/responses`, response);
  }

  updateResponse(id: number, response: CreateResponseRequest): Observable<NegotiationResponse> {
    return this.http.put<NegotiationResponse>(`${this.apiUrl}/api/negotiation-config/responses/${id}`, response);
  }

  deleteResponse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/negotiation-config/responses/${id}`);
  }
}