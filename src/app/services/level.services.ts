import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LevelService {
  private apiUrl = `${environment.baseUrl}/api/admin/levels`;

  constructor(private http: HttpClient) { }

  getAllLevels(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
  }

  getLevelById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addLevel(levelData: { name: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, levelData);
  }

  deleteLevel(levelId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${levelId}`);
  }
}