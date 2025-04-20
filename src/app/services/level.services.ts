import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
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

  getTotalLevelsCount(): Observable<number> {
    return this.getAllLevels().pipe(
      map(levels => levels.length)
    );
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

  getLevelAliases(levelId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-alias/${levelId}`);
  }

  createLevelAlias(aliasData: { levelId: number, aliasName: string }) {
    return this.http.post(`${this.apiUrl}/level-aliases`, aliasData);
  }
}