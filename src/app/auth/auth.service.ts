import {Injectable, OnInit} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {Auth, Profile} from '../app.component';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  // store the URL so we can redirect after logging in

  profile: Profile;

  redirectUrl: string;

  constructor(private http: HttpClient, private router: Router) {
  }


  ngOnInit(): void {
  }


  login(username: string, password: string): Observable<Auth> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http
      .post<Auth>('api/v1/signIn',
        {
          username: username,
          password: password
        }, httpOptions)
      .pipe(
        tap((auth: Auth) => {
          if (auth.access_token !== null && auth.access_token !== undefined) {
            localStorage.setItem('access_token', auth.access_token);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('access_token');
  }

  public loggedIn(): boolean {
    return localStorage.getItem('access_token') !== null;
  }

}
