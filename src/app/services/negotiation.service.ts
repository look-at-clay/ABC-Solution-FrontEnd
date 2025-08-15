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
    const url = `${this.apiUrl}/api/negotiation-config/categories/${id}`;
    console.log('PUT Category URL:', url);
    console.log('PUT Category Data:', category);
    return this.http.put<NegotiationCategory>(url, category);
  }

  deleteCategory(id: number): Observable<void> {
    const url = `${this.apiUrl}/api/negotiation-config/categories/${id}`;
    console.log('DELETE Category URL:', url);
    return this.http.delete<void>(url);
  }

  // Questions APIs
  getQuestionsByCategory(categoryId: number): Observable<NegotiationQuestion[]> {
    return this.http.get<NegotiationQuestion[]>(`${this.apiUrl}/api/negotiation-config/admin/categories/${categoryId}/questions`);
  }

  createQuestion(question: CreateQuestionRequest): Observable<NegotiationQuestion> {
    return this.http.post<NegotiationQuestion>(`${this.apiUrl}/api/negotiation-config/questions`, question);
  }

  updateQuestion(id: number, question: CreateQuestionRequest): Observable<NegotiationQuestion> {
    const url = `${this.apiUrl}/api/negotiation-config/questions/${id}`;
    console.log('PUT Question URL:', url);
    console.log('PUT Question Data:', question);
    return this.http.put<NegotiationQuestion>(url, question);
  }

  deleteQuestion(id: number): Observable<void> {
    const url = `${this.apiUrl}/api/negotiation-config/questions/${id}`;
    console.log('DELETE Question URL:', url);
    return this.http.delete<void>(url);
  }

  // Responses APIs
  getResponsesByQuestion(questionId: number): Observable<NegotiationResponse[]> {
    return this.http.get<NegotiationResponse[]>(`${this.apiUrl}/api/negotiation-config/admin/questions/${questionId}/responses`);
  }

  createResponse(response: CreateResponseRequest): Observable<NegotiationResponse> {
    return this.http.post<NegotiationResponse>(`${this.apiUrl}/api/negotiation-config/responses`, response);
  }

  updateResponse(id: number, response: CreateResponseRequest): Observable<NegotiationResponse> {
    const url = `${this.apiUrl}/api/negotiation-config/responses/${id}`;
    console.log('PUT Response URL:', url);
    console.log('PUT Response Data:', response);
    return this.http.put<NegotiationResponse>(url, response);
  }

  deleteResponse(id: number): Observable<void> {
    const url = `${this.apiUrl}/api/negotiation-config/responses/${id}`;
    console.log('DELETE Response URL:', url);
    return this.http.delete<void>(url);
  }
}