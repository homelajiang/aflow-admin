import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {AuthService} from '../auth/auth.service';
import {Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {retry} from 'rxjs/operators';
import {catchError} from 'rxjs/internal/operators/catchError';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req)
      .pipe(
        // retry(1),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            // client-size error
            errorMessage = error.error.message;
          } else {
            // server-side error
            errorMessage = error.message;

            if (error.status === 401) { // 401 跳转到登录界面
              this.router.navigateByUrl(`/login`);
              this.authService.logout();
            }

          }
          return throwError(errorMessage);
        })
      );
  }

}
