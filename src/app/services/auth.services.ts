import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

interface LoginResponse {
  token?: string;
  user?: any;
  // Add other response properties as needed
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  constructor(private http: HttpClient, private router: Router) { }
  
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.baseUrl}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem('auth_token', response.token);
            if (response.user) {
              localStorage.setItem('user', JSON.stringify(response.user));
            }
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
  }
  
  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }
  
  hasToken(): boolean {
    return !!localStorage.getItem('auth_token');
  }
  
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}