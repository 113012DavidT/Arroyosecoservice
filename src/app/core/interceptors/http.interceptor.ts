import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isAuthEndpoint = /\/Auth\/(login|register)$/i.test(req.url);
  const token = auth.getToken();

  const reqToSend = !isAuthEndpoint && token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(reqToSend).pipe(
    catchError((error: HttpErrorResponse) => {
      // If unauthorized on a protected call, clear token and redirect to appropriate login
      // BUT: Solo hacer logout en 401 si es una petición de acceso denegado real,
      // no si es por expiración del token o errores temporales
      if (error.status === 401 && !isAuthEndpoint && token) {
        // Verificar que sea un error de autenticación real (no de datos inválidos)
        const isRealAuthError = error.error?.message?.toLowerCase().includes('unauthorized') ||
                                error.error?.message?.toLowerCase().includes('token') ||
                                !error.error?.message;
        
        if (isRealAuthError) {
          auth.logout();
          const url = req.url.toLowerCase();
          if (url.includes('/admin/')) {
            router.navigateByUrl('/admin/login');
          } else if (url.includes('/oferente/')) {
            router.navigateByUrl('/oferente/login');
          } else {
            router.navigateByUrl('/cliente/login');
          }
        }
      }
      return throwError(() => error);
    })
  );
};
