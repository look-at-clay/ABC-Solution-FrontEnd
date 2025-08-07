// services/news.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { News, CreateNewsRequest, UpdateNewsRequest } from '../models/news.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewsService {
  private baseUrl = `${environment.baseUrl}/api/news`;

  constructor(private http: HttpClient) {}

  getAllNews(): Observable<News[]> {
    return this.http.get<News[]>(`${this.baseUrl}/getAllNews`);
  }

  getNewsById(id: number): Observable<News> {
    return this.http.get<News>(`${this.baseUrl}/getNewsById/${id}`);
  }

  createNews(news: CreateNewsRequest): Observable<News> {
    return this.http.post<News>(`${this.baseUrl}/addNews`, news);
  }

  updateNews(id: number, news: UpdateNewsRequest): Observable<News> {
    return this.http.put<News>(`${this.baseUrl}/updateNewsById/${id}`, news);
  }

  deleteNews(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/deleteNewsById/${id}`);
  }
}
