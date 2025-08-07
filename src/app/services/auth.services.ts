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
  
  login(email: string, password: string, rememberMe: boolean = false): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.baseUrl}/auth/login`, { email, password, rememberMe })
      .pipe(
        tap(response => {
          if (response && response.token) {
            // Use localStorage for persistent storage or sessionStorage for session-only storage
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('auth_token', response.token);
            if (response.user) {
              storage.setItem('user', JSON.stringify(response.user));
            }
            this.isAuthenticatedSubject.next(true);
          }
        })
      );
  }
  
  logout(): void {
    // Clear both localStorage and sessionStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('user');
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }
  
  hasToken(): boolean {
    return !!localStorage.getItem('auth_token') || !!sessionStorage.getItem('auth_token');
  }
  
  getToken(): string | null {
    return localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  }
}