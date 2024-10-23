import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private apiUrl = 'http://localhost:8080/api'; // Assurez-vous que c'est la bonne URL de votre API

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(
      JSON.parse(localStorage.getItem('currentUser') || 'null')
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    // Pour test en attendant que l'API soit prête
    const mockUser: User = {
      id: 1,
      username: username,
      email: username + '@example.com',
      token: 'mock-jwt-token'
    };
    
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    this.currentUserSubject.next(mockUser);
    return new Observable(subscriber => {
      subscriber.next(mockUser);
      subscriber.complete();
    });

    // Décommentez ce code quand l'API sera prête
    /*return this.http.post<User>(`${this.apiUrl}/auth/login`, { username, password })
      .pipe(map(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));*/
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  register(username: string, email: string, password: string) {
    return this.http.post(`${this.apiUrl}/auth/register`, { username, email, password });
  }
}